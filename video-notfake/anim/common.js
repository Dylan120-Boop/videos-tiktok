// Utilidades compartidas por las escenas animadas (se incluyen en cada HTML)
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const pr=(t,a,d)=>cl((t-a)/d);
const eo=x=>1-Math.pow(1-x,3);
const eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const bk=x=>{const c1=2.2,c3=c1+1;return x<=0?0:1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
const $=id=>document.getElementById(id);
function set(el,o,tr){el.style.opacity=o;el.style.transform=tr||'none'}
