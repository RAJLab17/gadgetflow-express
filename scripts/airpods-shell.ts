import view from "./airpods-shell-view.json";
import cherry from "../src/assets/matrix/schema/airpods-cherry-bolt.webp.asset.json";

/** Captured from the real /airpods-case header + purchase section (scripts/capture-airpods-shell.py). */
export function airpodsShellHead(): string {
  return `<link rel="preload" as="image" href="${cherry.url}" fetchpriority="high"><style>#__airpods_shell{position:absolute;inset:0 0 auto;z-index:60;min-height:100vh;background:#faf9f7;color:#2b2725;line-height:1.5;-webkit-text-size-adjust:100%}#__airpods_shell *{box-sizing:border-box}#__airpods_shell p{margin:0}#__airpods_shell button{font:inherit;margin:0;background:transparent;border:0;padding:0}#__airpods_shell img,#__airpods_shell svg{display:block;vertical-align:middle}#__airpods_shell img{max-width:100%}#__airpods_shell a{color:inherit;text-decoration:inherit}${view.css}</style>`;
}

export function airpodsShellScript(): string {
  return `<script>(function(){if(location.pathname.replace(/\\/$/,'')!=='/airpods-case')return;var root=document.getElementById('root');if(!root)return;var s=document.createElement('div');s.id='__airpods_shell';s.setAttribute('aria-hidden','true');s.innerHTML=window.matchMedia('(min-width:1024px)').matches?${JSON.stringify(view.desktop)}:${JSON.stringify(view.mobile)};root.insertAdjacentElement('afterend',s);s.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();},true);})();</script>`;
}
