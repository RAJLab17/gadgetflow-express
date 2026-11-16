import {Link} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {useBlackWeek} from '@/hooks/useBlackWeek';
import set from '@/assets/home/raj-set-original-900.webp.asset.json';
import '@/styles/black-week.css';
import {useEffect} from 'react';
export default function HomeBlackWeek(){
 const active=useBlackWeek();
 useEffect(()=>{if(!active||window.location.hash!=='#black-week')return;const timer=window.setTimeout(()=>{const section=document.getElementById('black-week');if(!section)return;const headerHeight=document.querySelector('header')?.getBoundingClientRect().height??134;window.scrollTo({top:window.scrollY+section.getBoundingClientRect().top-headerHeight-8,behavior:'instant'});},200);return()=>window.clearTimeout(timer);},[active]);
 if(!active)return null;
 return <section id="black-week" className="bw-home"><div className="bw-home-inner"><p className="bw-eyebrow">BLACK WEEK · BIS 30.11.</p><h2>Dein Apple-Setup. Zusammen.</h2><div className="bw-home-grid"><article className="bw-card"><img src={set.url} alt="MATRIX Hülle und AirPods Case in Cherry Carbon" loading="lazy" width={350} height={240}/><div><h3>MATRIX + AirPods Case gratis</h3><p>CHF 59 · inkl. AirPods Case im Wert von CHF 35</p><Button asChild><Link to="/matrix">Zur MATRIX</Link></Button></div></article><article className="bw-card"><img src="/assets/products/nexus-bedside-night.webp" alt="NEXUS 3-in-1 Ladestation auf dem Nachttisch" loading="lazy" width={350} height={240}/><div><h3>NEXUS 3-in-1 Qi2.2</h3><p>CHF 89 statt 99 · 2 Stück CHF 158</p><Button asChild><Link to="/nexus">Zur NEXUS</Link></Button></div></article></div><p className="bw-set-line">Alles im gleichen Look: NEXUS + MATRIX + AirPods Case zusammen CHF 148 (Einzelpreise zusammen CHF 193).</p><p className="bw-delivery">Bis 18.12. bestellt, vor Weihnachten bei dir.</p></div></section>;
}
