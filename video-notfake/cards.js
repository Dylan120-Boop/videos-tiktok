const fs=require('fs');
// Renderiza tarjetas (opacas) y overlays/subtítulos (transparentes) a PNG 1080x1920
const {chromium}=require('playwright');
const D='/home/user/videos-tiktok/web/notfake/img/';const IMG_=n=>'data:image/jpeg;base64,'+fs.readFileSync(D+n).toString('base64');
const head=`<link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:ital,wght@1,900&family=DM+Sans:wght@500;700&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden;background:transparent}
body{font-family:"DM Sans",sans-serif;color:#fff}
.anton{font-family:Anton,Impact,sans-serif;text-transform:uppercase;line-height:.9}
.logo{font-family:Archivo,sans-serif;font-weight:900;font-style:italic;line-height:.8;letter-spacing:-.03em;display:inline-flex;flex-direction:column}
.logo .n{color:#e62a2f;position:relative}.logo .n sup{font-size:.3em;position:absolute;top:.05em;right:-.6em;font-style:normal;color:#fff}.logo .f{color:#fff;font-size:.9em;margin-left:.1em}
.stroke{-webkit-text-stroke:0;paint-order:stroke fill;text-shadow:0 0 2px #000,0 6px 0 #000,0 0 18px rgba(0,0,0,.6)}
.kick{font:700 34px "DM Sans";letter-spacing:.14em;color:#e62a2f}
</style>`;
const cards={};
// --- Paso 1: estudio de marca (3 etapas)
for (const st of [0,1,2,3]) cards['p1_'+st]=`<body style="background:#0b0c0f">
<div style="position:absolute;top:250px;left:80px;right:80px">
 <div class="kick">PASO 1</div>
 <div class="anton" style="font-size:150px;margin-top:14px">Estudiar<br>la marca</div>
</div>
<div style="position:absolute;top:740px;left:80px;right:80px;display:flex;gap:30px">
 ${[['#000','NEGRO','sus redes','#444'],['#e62a2f','ROJO','el logo','#e62a2f'],['#fff','BLANCO','el producto','#fff']].map((c,i)=>`
 <div style="flex:1;opacity:${st>i?1:0.08};transform:translateY(${st>i?0:30}px)">
   <div style="height:300px;border-radius:26px;background:${c[0]};box-shadow:inset 0 0 0 3px ${c[3]}"></div>
   <div class="anton" style="font-size:58px;margin-top:22px">${c[1]}</div>
   <div style="font-size:32px;color:#9aa0a8;margin-top:6px">${c[2]}</div>
 </div>`).join('')}
</div>
<div style="position:absolute;top:1560px;left:0;right:0;text-align:center;opacity:.9"><span class="logo" style="font-size:120px"><span class="n">Not<sup>™</sup></span><span class="f">Fake</span></span></div>
</body>`;
// --- Paso 1b: tipografía y humor
for (const st of [0,1]) cards['p1b_'+st]=`<body style="background:#0f3d2a">
<div style="position:absolute;top:230px;left:80px;right:80px">
 <div class="kick" style="color:#f6d23a">LA LETRA DE SUS MEMES</div>
 <div class="anton" style="font-size:150px;margin-top:24px">A trabajar<br>porque<br><span style="color:#f6d23a">no&nbsp;se&nbsp;va<br>a pagar solo</span></div>
</div>
<div style="position:absolute;top:1060px;left:80px;opacity:${st?1:0};transform:rotate(-4deg)">
 <div class="anton" style="background:#e62a2f;font-size:92px;padding:16px 30px">Onda callejera</div>
 <div class="anton" style="background:#fff;color:#000;font-size:92px;padding:16px 30px;margin:16px 0 0 120px;display:inline-block">Con humor</div>
</div>
</body>`;
// --- Paso 2: estructura (wireframe)
for (const st of [0,1,2,3,4]) { const W=st>=4; const bg=W?'#fff':'#1a1d23'; const blk=W?'#e9e9e6':'#2c313a';
cards['p2_'+st]=`<body style="background:#0b0c0f">
<div style="position:absolute;top:200px;left:80px;right:80px">
 <div class="kick">PASO 2</div>
 <div class="anton" style="font-size:120px;margin-top:14px">La estructura</div>
</div>
<div style="position:absolute;top:500px;left:170px;width:740px;height:700px;border-radius:40px;background:${bg};overflow:hidden;box-shadow:0 0 0 10px #2a2d33">
 <div style="height:56px;background:#000;opacity:${st>=1?1:0};display:flex;align-items:center;justify-content:center;font:700 22px 'DM Sans';letter-spacing:.1em">BLACK FRIDAY · HASTA 40% OFF</div>
 <div style="height:60px;display:flex;align-items:center;justify-content:center;border-bottom:2px solid ${blk}"><span class="logo" style="font-size:26px"><span class="n">Not</span><span class="f" style="color:${W?'#111':'#fff'}">Fake</span></span></div>
 <div style="display:flex;height:330px;opacity:${st>=2?1:.12}">
   <div style="flex:1;background:url(${IMG_('wall.jpg')}) center/cover"></div><div style="flex:1;background:url(${IMG_('adidas.jpg')}) center/cover"></div></div>
 <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:26px 22px;opacity:${st>=3?1:.12}">
  ${['jordan-canary','dunk-green','offwhite','supreme-jacket','youngla','camo','fog-cap','tnf'].map(n=>`<div><div style="aspect-ratio:1;background:#fff url(${IMG_(n+'.jpg')}) center/80% no-repeat;border-radius:8px"></div><div style="height:9px;background:${blk};margin:10px 8px 0;border-radius:4px"></div></div>`).join('')}
 </div>
</div>
<div style="position:absolute;top:1235px;left:80px;right:80px;display:flex;justify-content:space-between;font:700 30px 'DM Sans';color:#9aa0a8">
 ${['Anuncios','Fotos grandes','Grilla','Fondo blanco'].map((t,i)=>`<span style="color:${st>i?'#fff':'#444'}">${st>i?'✓ ':''}${t}</span>`).join('')}
</div>
</body>`; }
// --- Cierre
cards['end']=`<body style="background:#000">
<div style="position:absolute;inset:0;background:url(${IMG_('wall.jpg')}) center/cover;opacity:.28"></div>
<div style="position:absolute;inset:0;background:linear-gradient(#000 0%,rgba(0,0,0,.2) 45%,#000 100%)"></div>
<div style="position:absolute;top:420px;left:0;right:0;text-align:center"><span class="logo" style="font-size:300px"><span class="n">Not<sup>™</sup></span><span class="f">Fake</span></span>
 <div class="anton" style="font-size:64px;margin-top:40px;letter-spacing:.02em">Bolivia · 100% Legit</div></div>
<div style="position:absolute;top:1060px;left:0;right:0;text-align:center;font:700 40px 'DM Sans'">
 <div>TORRES PLATINUM · SANTA CRUZ</div><div style="color:#e62a2f;margin-top:18px">@notfake_bol</div></div>
</body>`;
// --- Overlays transparentes
const ov={};
ov['top_hook']=`<body><div style="position:absolute;top:0;left:0;right:0;height:640px;background:linear-gradient(rgba(0,0,0,.92) 70%,transparent)"></div><div style="position:absolute;top:200px;left:60px;right:60px;text-align:center" class="anton"><span style="font-size:96px">¿La tienda más<br><span style="color:#e62a2f">exclusiva</span> de Santa Cruz?</span></div></body>`;
ov['stamp']=`<body><div style="position:absolute;top:560px;left:0;right:0;text-align:center"><div class="anton" style="display:inline-block;font-size:150px;color:#e62a2f;border:14px solid #e62a2f;padding:20px 40px;transform:rotate(-8deg);background:rgba(255,255,255,.92)">Sin página<br>web</div></div></body>`;
ov['top_p3']=`<body><div style="position:absolute;top:330px;left:0;right:0;text-align:center"><div class="kick" style="display:inline-block;background:#e62a2f;color:#fff;padding:14px 26px;letter-spacing:.12em">PASO 3 · EL RESULTADO</div></div></body>`;
ov['top_altura']=`<body><div style="position:absolute;top:300px;left:60px;right:60px;text-align:center" class="anton stroke"><span style="font-size:110px">Una página<br>a su <span style="color:#e62a2f">altura</span></span></div></body>`;
// Subtítulos
const caps=JSON.parse(fs.readFileSync('captions.json'));
caps.forEach((c,i)=>{ ov['cap_'+String(i).padStart(2,'0')]=`<body><div style="position:absolute;top:1330px;left:50px;right:50px;text-align:center" class="anton"><span style="display:inline-block;background:rgba(0,0,0,.78);padding:14px 26px 18px;border-radius:18px;font-size:${c.t.length>24?72:c.t.length>16?84:100}px">${c.t.replace(/\*(.+?)\*/g,'<span style="color:#f6d23a">$1</span>')}</span></div></body>`; });
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
 for(const [k,h] of Object.entries(cards)){await p.setContent(head+h,{waitUntil:'networkidle'});await p.screenshot({path:`build/${k}.png`});}
 for(const [k,h] of Object.entries(ov)){await p.setContent(head+h,{waitUntil:'networkidle'});await p.screenshot({path:`build/${k}.png`,omitBackground:true});}
 await b.close();console.log('ok',Object.keys(cards).length,Object.keys(ov).length);})();
