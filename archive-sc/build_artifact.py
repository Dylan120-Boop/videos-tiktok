# Genera artifact.html: la misma página con las fotos incrustadas (data URI),
# para que se vean en cualquier visor, incluido el celular.
import base64, io, json, re
from PIL import Image
s = open('index.html', encoding='utf-8').read()
names = sorted(set(re.findall(r"'([a-z-]+)'", re.search(r"const P=\[(.*?)\];", s, re.S).group(1))) | {'polo-spiral', 'brooks-polos'})
data = {}
for n in names:
    try: im = Image.open(f'img/{n}.webp').convert('RGB')
    except FileNotFoundError: continue
    im.thumbnail((900, 900))
    b = io.BytesIO(); im.save(b, 'JPEG', quality=74, optimize=True, progressive=True)
    data[n] = 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
s = s.replace("const IMG=n=>'img/'+n+'.webp'; // IMG_HOOK", "const IMG_D=" + json.dumps(data) + ";const IMG=n=>IMG_D[n];")
for n in ('polo-spiral', 'brooks-polos'):
    s = s.replace(f'src="img/{n}.webp" data-i="{n}"', f'src="{data[n]}" data-i="{n}"')
assert 'img/' not in s.replace("'img/'", ''), 'quedó una ruta img/'
open('artifact.html', 'w', encoding='utf-8').write(s)
print(len(data), 'fotos,', round(len(s) / 1e6, 2), 'MB')
