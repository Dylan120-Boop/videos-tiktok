const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const [h,ts] of [['cards.html',[17.5,20.6,21.0,23.6,25.05,27,30.5,31.6]],['end.html',[45.4,47]],['overlay.html',[0.9,13.1,33.0,42.0,5.0,22.5]]]){
 await p.goto('file://'+require('path').resolve(h));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
 for(const t of ts){await p.evaluate(t=>draw(t),t);await p.screenshot({path:`/tmp/claude-0/-home-user-videos-tiktok/b9f0a0c7-1b9a-57e5-87c6-9f52ee4e0d77/scratchpad/t_${h}_${t}.png`,omitBackground:h==='overlay.html'});}}
await b.close()})();
