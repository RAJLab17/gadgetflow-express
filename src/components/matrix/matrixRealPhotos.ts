import cherryHand1200 from "@/assets/matrix/real/matrix-cherry-hand-fels-1200.webp.asset.json";
import cherryHand800 from "@/assets/matrix/real/matrix-cherry-hand-fels-800.webp.asset.json";
import cherryHand400 from "@/assets/matrix/real/matrix-cherry-hand-fels-400.webp.asset.json";
import onyxHand1200 from "@/assets/matrix/real/matrix-onyx-hand-see-1200.webp.asset.json";
import onyxHand800 from "@/assets/matrix/real/matrix-onyx-hand-see-800.webp.asset.json";
import onyxHand400 from "@/assets/matrix/real/matrix-onyx-hand-see-400.webp.asset.json";
import rock1200 from "@/assets/matrix/real/matrix-cherry-onyx-fels-1200.webp.asset.json";
import rock800 from "@/assets/matrix/real/matrix-cherry-onyx-fels-800.webp.asset.json";
import rock400 from "@/assets/matrix/real/matrix-cherry-onyx-fels-400.webp.asset.json";
import set1200 from "@/assets/matrix/real/matrix-cherry-set-see-1200.webp.asset.json";
import set800 from "@/assets/matrix/real/matrix-cherry-set-see-800.webp.asset.json";
import set400 from "@/assets/matrix/real/matrix-cherry-set-see-400.webp.asset.json";
export const matrixRealPhotos = {
 cherryHand: { full: cherryHand1200.url, mobile: cherryHand800.url, small: cherryHand400.url, alt: "RAJ MATRIX Hülle in Cherry Carbon in der Hand" },
 onyxHand: { full: onyxHand1200.url, mobile: onyxHand800.url, small: onyxHand400.url, alt: "RAJ MATRIX Hülle in Onyx Carbon an einem iPhone, in der Hand am See" },
 rock: { full: rock1200.url, mobile: rock800.url, small: rock400.url, alt: "RAJ MATRIX Hüllen in Cherry Carbon und Onyx Carbon am Fels" },
 set: { full: set1200.url, mobile: set800.url, small: set400.url, alt: "RAJ MATRIX Hülle und AirPods-Hülle in Cherry Carbon, in der Hand am See" },
};
export type MatrixRealPhoto = typeof matrixRealPhotos.cherryHand;
export const realPhotoSrcSet = (p: MatrixRealPhoto) => `${p.small} 400w, ${p.mobile} 800w, ${p.full} 1200w`;
