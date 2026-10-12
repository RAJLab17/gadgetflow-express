import view from "./nexus-shell-view.json";

/** Captured from the existing NEXUS header/hero, not a second checkout implementation. */
export function nexusShellCss(): string {
  return `<style>#__nexus_shell{position:absolute;inset:0 0 auto;z-index:60;min-height:100vh;background:#fff;color:#1a1a1a;font-family:var(--font-sans,-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif);line-height:1.5;-webkit-text-size-adjust:100%}#__nexus_shell *{box-sizing:border-box}#__nexus_shell p{margin:0}#__nexus_shell button{font:inherit;margin:0}#__nexus_shell img,#__nexus_shell svg{display:block;vertical-align:middle}#__nexus_shell img{max-width:100%}#__nexus_shell a{color:inherit;text-decoration:inherit}${view.css}</style>`;
}

export function nexusShellScript(): string {
  return `<script>(function(){if(location.pathname.replace(/\\/$/,'')!=='/nexus')return;var root=document.getElementById('root');if(!root)return;var shell=document.createElement('div');shell.id='__nexus_shell';shell.setAttribute('aria-hidden','true');shell.innerHTML=${JSON.stringify(view.html)};root.insertAdjacentElement('afterend',shell);shell.addEventListener('click',function(e){var buy=e.target.closest('a[role="button"]');if(buy)e.preventDefault();});})();</script>`;
}