import {Link} from 'react-router-dom';
import {useBlackWeekCatalog} from '@/hooks/useBlackWeekCatalog';
import {useCartTotal} from '@/hooks/useCartTotal';
import { chf, chfShort, amount, fillPrices } from '@/lib/livePrice';
import {Button} from '@/components/ui/button';
import {useBlackWeek} from '@/hooks/useBlackWeek';
import set from '@/assets/home/raj-set-original-900.webp.asset.json';
import '@/styles/black-week.css';
import {useEffect} from 'react';
export default function HomeBlackWeek(){
 const {active,nexus,matrix,airpods}=useBlackWeekCatalog();
 const nx=amount(nexus?.price), nxWas=amount(nexus?.compareAtPrice), mx=amount(matrix?.price), ap=amount(airpods?.price);
 const pair=useCartTotal(active&&nexus?[{id:nexus.id,quantity:2}]:null);
 const trio=useCartTotal(active&&nexus&&matrix&&airpods?[{id:nexus.id,quantity:1},{id:matrix.id,quantity:1},{id:airpods.id,quantity:1}]:null);
 useEffect(()=>{if(!active||window.location.hash!=='#black-week')return;const timer=window.setTimeout(()=>{const section=document.getElementById('black-week');if(!section)return;const headerHeight=document.querySelector('header')?.getBoundingClientRect().height??134;window.scrollTo({top:window.scrollY+section.getBoundingClientRect().top-headerHeight-8,behavior:'instant'});},200);return()=>window.clearTimeout(timer);},[active]);
 if(!active)return null;
 return <section id="black-week" className="bw-home"><div className="bw-home-inner"><p className="bw-eyebrow">BLACK WEEK · BIS 30.11.</p><h2>Dein Apple-Setup. Zusammen.</h2><div className="bw-home-grid"><article className="bw-card"><img src={set.url} alt="MATRIX Hülle und AirPods Case in Cherry Carbon" loading="lazy" width={350} height={240}/><div><h3>MATRIX + AirPods Case gratis</h3><p>{chf(mx)} · inkl. AirPods Case im Wert von {chf(ap)}</p><Button asChild><Link to="/matrix">Zur MATRIX</Link></Button></div></article><article className="bw-card"><img src="/assets/products/nexus-bedside-night.webp" alt="NEXUS 3-in-1 Ladestation auf dem Nachttisch" loading="lazy" width={350} height={240}/><div><h3>NEXUS 3-in-1 Qi2.2</h3><p>{chf(nx)}{nxWas!=null&&nx!=null&&nxWas>nx?<> statt <del>{chfShort(nxWas)}</del></>:null} · 2 Stück {chf(pair)}</p><Button asChild><Link to="/nexus">Zur NEXUS</Link></Button></div></article></div><p className="bw-set-line">Alles im gleichen Look: NEXUS + MATRIX + AirPods Case zusammen {chf(trio)} (Einzelpreise zusammen {chf(nx!=null&&mx!=null&&ap!=null?(nxWas??nx)+mx+ap:null)}).</p><p className="bw-delivery">Bis 18.12. bestellt, vor Weihnachten bei dir.</p></div></section>;
}
