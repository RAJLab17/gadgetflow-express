import view from "./airpods-shell-view.json";
import p400 from "../src/assets/matrix/airpods-gallery/airpods-cherry-product-400.webp.asset.json";
import p800 from "../src/assets/matrix/airpods-gallery/airpods-cherry-product-800.webp.asset.json";
import p1200 from "../src/assets/matrix/airpods-gallery/airpods-cherry-product-1200.webp.asset.json";

/** Must match GALLERY_SIZES and slideSrcSet in AirpodsPage so the preload is reused. */
const SIZES = "(max-width: 767px) 100vw, 460px";
const SRCSET = `${p400.url} 400w, ${p800.url} 800w, ${p1200.url} 1200w`;

/** Captured from the real /airpods-case header + purchase section (scripts/capture-airpods-shell.py). */
export function airpodsShellHead(): string {
  return `<link rel="preload" as="image" href="${p1200.url}" imagesrcset="${SRCSET}" imagesizes="${SIZES}" fetchpriority="high"><style>#__airpods_shell{position:absolute;inset:0 0 auto;z-index:60;min-height:100vh;background:#faf9f7;color:#2b2725;line-height:1.5;-webkit-text-size-adjust:100%}#__airpods_shell *{box-sizing:border-box}#__airpods_shell p{margin:0}#__airpods_shell button{font:inherit;margin:0;background:transparent;border:0;padding:0}#__airpods_shell img,#__airpods_shell svg{display:block;vertical-align:middle}#__airpods_shell img{max-width:100%}#__airpods_shell a{color:inherit;text-decoration:inherit}${view.css}</style>`;
}

export function airpodsShellScript(): string {
  return `<script>(function(){if(location.pathname.replace(/\\/$/,'')!=='/airpods-case')return;var root=document.getElementById('root');if(!root)return;var s=document.createElement('div');s.id='__airpods_shell';s.setAttribute('aria-hidden','true');s.innerHTML=window.matchMedia('(min-width:1024px)').matches?${JSON.stringify(view.desktop)}:${JSON.stringify(view.mobile)};root.insertAdjacentElement('afterend',s);s.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();},true);})();</script>`;
}
