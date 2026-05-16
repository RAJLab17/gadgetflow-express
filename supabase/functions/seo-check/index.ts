import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const BASE = "https://raj.ch";

interface UrlCheck {
  url: string;
  status: number | null;
  contentType: string | null;
  ok: boolean;
  error?: string;
}

interface SitemapCheck extends UrlCheck {
  xmlValid: boolean;
  locCount: number;
  locs: string[];
  xmlError?: string;
}

interface SeoReport {
  checkedAt: string;
  robots: UrlCheck & { sitemapsListed: string[] };
  sitemaps: SitemapCheck[];
  crossCheck: {
    inRobotsButNotFound: string[];
    inFsButNotInRobots: string[];
  };
  pageChecks: UrlCheck[];
  imageChecks: UrlCheck[];
  missingImages: string[];
  summary: {
    totalUrls: number;
    okUrls: number;
    failedUrls: number;
    missingImageCount: number;
    overallOk: boolean;
  };
}

async function head(url: string): Promise<UrlCheck> {
  try {
    // Some hosts don't support HEAD; fall back to GET
    let res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { method: "GET", redirect: "follow" });
      // consume body to avoid leaks
      await res.text();
    }
    return {
      url,
      status: res.status,
      contentType: res.headers.get("content-type"),
      ok: res.ok,
    };
  } catch (e) {
    return { url, status: null, contentType: null, ok: false, error: String(e) };
  }
}

async function fetchText(url: string): Promise<{ res: Response; text: string } | { error: string }> {
  try {
    const res = await fetch(url, { redirect: "follow" });
    const text = await res.text();
    return { res, text };
  } catch (e) {
    return { error: String(e) };
  }
}

function parseSitemapsFromRobots(txt: string): string[] {
  return txt
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => /^sitemap:/i.test(l))
    .map((l) => l.replace(/^sitemap:\s*/i, "").trim());
}

function parseLocs(xml: string): { locs: string[]; valid: boolean; error?: string } {
  // Lightweight XML check + <loc> extraction (works for urlset & sitemapindex).
  const trimmed = xml.trim();
  if (!trimmed.startsWith("<?xml") && !trimmed.startsWith("<urlset") && !trimmed.startsWith("<sitemapindex")) {
    return { locs: [], valid: false, error: "Document does not look like XML" };
  }
  const matches = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)];
  return { locs: matches.map((m) => m[1]), valid: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const checkedAt = new Date().toISOString();

  // 1. robots.txt
  const robotsUrl = `${BASE}/robots.txt`;
  const robotsFetch = await fetchText(robotsUrl);
  let robotsCheck: SeoReport["robots"];
  let sitemapsListed: string[] = [];

  if ("error" in robotsFetch) {
    robotsCheck = {
      url: robotsUrl,
      status: null,
      contentType: null,
      ok: false,
      error: robotsFetch.error,
      sitemapsListed: [],
    };
  } else {
    sitemapsListed = parseSitemapsFromRobots(robotsFetch.text);
    robotsCheck = {
      url: robotsUrl,
      status: robotsFetch.res.status,
      contentType: robotsFetch.res.headers.get("content-type"),
      ok: robotsFetch.res.ok,
      sitemapsListed,
    };
  }

  // 2. Sitemaps to check (union of well-known + robots-listed)
  const wellKnown = [
    `${BASE}/sitemap-index.xml`,
    `${BASE}/sitemap.xml`,
    `${BASE}/sitemap-images.xml`,
  ];
  const sitemapUrls = Array.from(new Set([...wellKnown, ...sitemapsListed]));

  // 3. Fetch + parse each sitemap
  const sitemaps: SitemapCheck[] = [];
  const allLocs = new Set<string>();
  const allImageLocs = new Set<string>();
  for (const sUrl of sitemapUrls) {
    const r = await fetchText(sUrl);
    if ("error" in r) {
      sitemaps.push({
        url: sUrl,
        status: null,
        contentType: null,
        ok: false,
        error: r.error,
        xmlValid: false,
        locCount: 0,
        locs: [],
      });
      continue;
    }
    const ct = r.res.headers.get("content-type");
    const parsed = parseLocs(r.text);
    parsed.locs.forEach((l) => allLocs.add(l));
    // Extract <image:loc> tags too
    const imgMatches = [...r.text.matchAll(/<image:loc>\s*([^<\s]+)\s*<\/image:loc>/gi)];
    imgMatches.forEach((m) => allImageLocs.add(m[1]));
    sitemaps.push({
      url: sUrl,
      status: r.res.status,
      contentType: ct,
      ok: r.res.ok,
      xmlValid: parsed.valid,
      xmlError: parsed.error,
      locCount: parsed.locs.length,
      locs: parsed.locs,
    });
  }

  // 4. Cross-check robots ↔ sitemaps
  const inRobotsButNotFound = sitemapsListed.filter((u) => {
    const match = sitemaps.find((s) => s.url === u);
    return !match || !match.ok;
  });
  const inFsButNotInRobots = wellKnown.filter((u) => !sitemapsListed.includes(u));

  // 5. Crawl every page URL from sitemaps (skip image-only sitemap entries duplicates)
  const pageUrls = [...allLocs].filter((u) => /^https?:\/\/(www\.)?raj\.ch/i.test(u));

  const concurrency = 6;
  const pageChecks: UrlCheck[] = [];
  let cursor = 0;
  async function pageWorker() {
    while (cursor < pageUrls.length) {
      const i = cursor++;
      pageChecks.push(await head(pageUrls[i]));
    }
  }
  await Promise.all(Array.from({ length: concurrency }, pageWorker));

  // 6. Crawl every image URL from sitemap-images
  const imageUrls = [...allImageLocs].filter((u) => /^https?:\/\/(www\.)?raj\.ch/i.test(u));
  const imageChecks: UrlCheck[] = [];
  let iCursor = 0;
  async function imageWorker() {
    while (iCursor < imageUrls.length) {
      const i = iCursor++;
      imageChecks.push(await head(imageUrls[i]));
    }
  }
  await Promise.all(Array.from({ length: concurrency }, imageWorker));
  const missingImages = imageChecks.filter((c) => !c.ok).map((c) => c.url);

  const totalUrls = pageChecks.length + imageChecks.length + sitemaps.length + 1;
  const failedUrls =
    pageChecks.filter((p) => !p.ok).length +
    imageChecks.filter((p) => !p.ok).length +
    sitemaps.filter((s) => !s.ok || !s.xmlValid).length +
    (robotsCheck.ok ? 0 : 1);
  const okUrls = totalUrls - failedUrls;

  const report: SeoReport = {
    checkedAt,
    robots: robotsCheck,
    sitemaps,
    crossCheck: { inRobotsButNotFound, inFsButNotInRobots },
    pageChecks,
    imageChecks,
    missingImages,
    summary: {
      totalUrls,
      okUrls,
      failedUrls,
      missingImageCount: missingImages.length,
      overallOk: failedUrls === 0 && inRobotsButNotFound.length === 0,
    },
  };

  return new Response(JSON.stringify(report, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
});
