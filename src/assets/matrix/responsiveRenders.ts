import f0 from "./uploaded-renders/17-cherry-orange-norm-full.webp.asset.json";
import m0 from "./uploaded-renders/17-cherry-orange-norm-mobile.webp.asset.json";
import v0 from "./uploaded-renders/17-cherry-orange-norm-thumb.webp.asset.json";
import f1 from "./uploaded-renders/17-cherry-blue-norm-full.webp.asset.json";
import m1 from "./uploaded-renders/17-cherry-blue-norm-mobile.webp.asset.json";
import v1 from "./uploaded-renders/17-cherry-blue-norm-thumb.webp.asset.json";
import f2 from "./uploaded-renders/17-cherry-silver-norm-full.webp.asset.json";
import m2 from "./uploaded-renders/17-cherry-silver-norm-mobile.webp.asset.json";
import v2 from "./uploaded-renders/17-cherry-silver-norm-thumb.webp.asset.json";
import f3 from "./uploaded-renders/17-onyx-orange-v2-full.webp.asset.json";
import m3 from "./uploaded-renders/17-onyx-orange-v2-mobile.webp.asset.json";
import v3 from "./uploaded-renders/17-onyx-orange-v2-thumb.webp.asset.json";
import f4 from "./uploaded-renders/17-onyx-blue-v2-full.webp.asset.json";
import m4 from "./uploaded-renders/17-onyx-blue-v2-mobile.webp.asset.json";
import v4 from "./uploaded-renders/17-onyx-blue-v2-thumb.webp.asset.json";
import f5 from "./uploaded-renders/onyx-silver-v2-full.webp.asset.json";
import m5 from "./uploaded-renders/onyx-silver-v2-mobile.webp.asset.json";
import v5 from "./uploaded-renders/onyx-silver-v2-thumb.webp.asset.json";
import f6 from "./uploaded-renders/18-cherry-darkcherry-norm-full.webp.asset.json";
import m6 from "./uploaded-renders/18-cherry-darkcherry-norm-mobile.webp.asset.json";
import v6 from "./uploaded-renders/18-cherry-darkcherry-norm-thumb.webp.asset.json";
import f7 from "./uploaded-renders/18-cherry-darkgrey-norm-full.webp.asset.json";
import m7 from "./uploaded-renders/18-cherry-darkgrey-norm-mobile.webp.asset.json";
import v7 from "./uploaded-renders/18-cherry-darkgrey-norm-thumb.webp.asset.json";
import f8 from "./uploaded-renders/18-cherry-silver-norm-full.webp.asset.json";
import m8 from "./uploaded-renders/18-cherry-silver-norm-mobile.webp.asset.json";
import v8 from "./uploaded-renders/18-cherry-silver-norm-thumb.webp.asset.json";
import f9 from "./uploaded-renders/18-cherry-skyblue-norm-full.webp.asset.json";
import m9 from "./uploaded-renders/18-cherry-skyblue-norm-mobile.webp.asset.json";
import v9 from "./uploaded-renders/18-cherry-skyblue-norm-thumb.webp.asset.json";
import f10 from "./uploaded-renders/18-onyx-darkcherry-v2-full.webp.asset.json";
import m10 from "./uploaded-renders/18-onyx-darkcherry-v2-mobile.webp.asset.json";
import v10 from "./uploaded-renders/18-onyx-darkcherry-v2-thumb.webp.asset.json";
import f11 from "./uploaded-renders/18-onyx-darkgrey-v2-full.webp.asset.json";
import m11 from "./uploaded-renders/18-onyx-darkgrey-v2-mobile.webp.asset.json";
import v11 from "./uploaded-renders/18-onyx-darkgrey-v2-thumb.webp.asset.json";
import f12 from "./uploaded-renders/18-onyx-skyblue-v2-full.webp.asset.json";
import m12 from "./uploaded-renders/18-onyx-skyblue-v2-mobile.webp.asset.json";
import v12 from "./uploaded-renders/18-onyx-skyblue-v2-thumb.webp.asset.json";
import thumb13 from "./responsive/airpods-cherry-bolt-thumb.webp.asset.json";
import thumb14 from "./responsive/airpods-onyx-original-bolt-thumb.webp.asset.json";
import two17 from "./responsive/two-cases-17-thumb.webp.asset.json";
import two18 from "./responsive/two-cases-18-thumb.webp.asset.json";
export const renderSizes = new Map<string, { mobile: string; thumb: string }>([
  [f0.url, { mobile: m0.url, thumb: v0.url }],
  [f1.url, { mobile: m1.url, thumb: v1.url }],
  [f2.url, { mobile: m2.url, thumb: v2.url }],
  [f3.url, { mobile: m3.url, thumb: v3.url }],
  [f4.url, { mobile: m4.url, thumb: v4.url }],
  [f5.url, { mobile: m5.url, thumb: v5.url }],
  [f6.url, { mobile: m6.url, thumb: v6.url }],
  [f7.url, { mobile: m7.url, thumb: v7.url }],
  [f8.url, { mobile: m8.url, thumb: v8.url }],
  [f9.url, { mobile: m9.url, thumb: v9.url }],
  [f10.url, { mobile: m10.url, thumb: v10.url }],
  [f11.url, { mobile: m11.url, thumb: v11.url }],
  [f12.url, { mobile: m12.url, thumb: v12.url }],
]);
export const airpodsThumbs = { cherry: thumb13.url, onyx: thumb14.url };
export const twoCaseThumbs = { "17": two17.url, "18": two18.url };
// Mobile slot capped at 266px so even 3x screens pick the 800w file, never 1200w.
export const renderImageSizes = "(max-width: 1023px) 266px, 1200px";

// Desktop: 1200w full + 800w mobile; matches the route preload in vite.config.ts.
export const renderSrcSet = (src: string) => {
  const sizes = renderSizes.get(src);
  return sizes ? `${sizes.mobile} 800w, ${src} 1200w` : undefined;
};
