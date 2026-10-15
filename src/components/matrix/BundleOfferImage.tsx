import cherryAirpods from "@/assets/matrix/responsive/airpods-cherry-premium-thumb.webp.asset.json";
import onyxAirpods from "@/assets/matrix/responsive/airpods-onyx-premium-thumb.webp.asset.json";
import cherry17 from "@/assets/matrix/responsive/17-cherry-cherry-silver-thumb.webp.asset.json";
import cherry18 from "@/assets/matrix/responsive/18-cherry-cherry-silver-thumb.webp.asset.json";
import onyxSilver from "@/assets/matrix/responsive/onyx-silver-thumb.webp.asset.json";
import MatrixSwapImage from "./MatrixSwapImage";

export const originalAirpodsThumbs: Record<string, string> = {
  cherry: cherryAirpods.url,
  onyx: onyxAirpods.url,
};

export function bundlePhoneThumb(modelId: string, finishId: string) {
  return finishId === "onyx" ? onyxSilver.url : modelId.startsWith("17") ? cherry17.url : cherry18.url;
}

/** Shared composition only; selections, pricing and commerce remain owned by each page. */
export default function BundleOfferImage({ phoneSrc, finishId, finishName, seamless = false }: {
  phoneSrc: string;
  finishId: string;
  finishName: string;
  seamless?: boolean;
}) {
  const Image = seamless ? MatrixSwapImage : "img";
  return (
    <span className="absolute inset-0 flex items-center" role="group" aria-label={`MATRIX AirPods Hülle und MATRIX iPhone Hülle in ${finishName}`}>
      <span className="relative h-full w-[45%]">
      <Image src={phoneSrc} width={160} height={160} loading="lazy" decoding="async"
        alt={`MATRIX iPhone Hülle in ${finishName}`}
        className="absolute inset-0 h-full w-full object-contain" />
      </span>
      <span className="relative h-full w-[55%]">
      <Image src={originalAirpodsThumbs[finishId]} width={160} height={160} loading="lazy" decoding="async"
        alt={`MATRIX AirPods Hülle in ${finishName}`}
        className="absolute inset-0 h-full w-full object-contain" />
      </span>
    </span>
  );
}