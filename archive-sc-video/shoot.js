const {chromium}=require('playwright');
(async()=>{const [mode,...ts]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/stage.html');const info=await p.evaluate(()=>window.ready);
if(mode==='test'){for(const t of ts){await p.evaluate(t=>render(+t),t);await p.screenshot({path:`test/t_${t}.jpg`,quality:70,type:'jpeg'})}}
else{require('fs').writeFileSync('hits.json',JSON.stringify(info));const n=Math.round(info.END*12);for(let i=0;i<n;i++){await p.evaluate(t=>render(t),i/12);await p.screenshot({path:`out/${String(i).padStart(4,'0')}.jpg`,quality:90,type:'jpeg'});if(i%60===0)console.log(i,'/',n)}}
console.log('errs',errs);await b.close()})();
