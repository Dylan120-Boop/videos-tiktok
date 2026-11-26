// node render.js page.html start end outdir transparent(0/1) workers
const {chromium}=require('playwright');
const [html,s,e,out,tr,wk]=process.argv.slice(2);const S=+s,E=+e,T=tr==='1',W=+(wk||4),FPS=30;
const fs=require('fs');fs.mkdirSync(out,{recursive:true});
const N=Math.round((E-S)*FPS);
(async()=>{const b=await chromium.launch();
 const jobs=[...Array(W)].map(async(_,w)=>{const p=await b.newPage({viewport:{width:1080,height:1920}});
  await p.goto('file://'+require('path').resolve(html));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
  for(let f=w;f<N;f+=W){const t=S+f/FPS;await p.evaluate(t=>draw(t),t);
   await p.screenshot({path:`${out}/f${String(f).padStart(5,'0')}.${T?'png':'jpg'}`,omitBackground:T,...(T?{}:{quality:92,type:'jpeg'})});}});
 await Promise.all(jobs);await b.close();console.log('frames',N);})();
