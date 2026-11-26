import json,subprocess,os
U='/root/.claude/uploads/b9f0a0c7-1b9a-57e5-87c6-9f52ee4e0d77/'
TT=U+'c66312c6-ScreenRecording_11-25-2026_20-45-37_1.mp4'
PH=U+'2b74b0c0-ScreenRecording_11-25-2026_22-20-18_1.mp4'
IP=U+'1a4fea95-ScreenRecording_11-25-2026_22-20-42_1.mp4'
AU=U+'f2ffff98-ElevenLabs_2026-11-26T02_31_31_Dylan__eleven_v4.mp3'
IMG='/home/user/videos-tiktok/web/notfake/img/'
B='build/'; FPS=30; END=53.2
clips=[]
def run(a): subprocess.run(['ffmpeg','-v','error','-y']+a,check=True)
def vid(name,src,ss,dur,vf,speed=1.0):
    out=B+f'c_{len(clips):02d}_{name}.mp4'
    run(['-ss',str(ss),'-t',str(dur*speed),'-i',src,'-vf',f'setpts=PTS/{speed},{vf},fps={FPS},format=yuv420p','-t',str(dur),'-an','-c:v','libx264','-preset','veryfast','-crf','18',out]); clips.append(out)
def still(name,img,dur,zoom=0.0,pre=None,bg=None):
    out=B+f'c_{len(clips):02d}_{name}.mp4'; n=int(round(dur*FPS))
    pre=pre or 'scale=1080:1920'
    z=f",scale=2160:3840,zoompan=z='1+{zoom}*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps={FPS}" if zoom else ''
    run(['-loop','1','-i',img,'-vf',f'{pre}{z},fps={FPS},format=yuv420p','-frames:v',str(n),'-c:v','libx264','-preset','veryfast','-crf','18',out]); clips.append(out)
T=[0,4.89]
vid('hook',TT,0,4.89,'crop=938:1668:725:0,scale=1080:1920')
prods=['jordan-canary','dunk-green','supreme-jacket','asics','fog-cap']
d=(9.23-4.89)/len(prods)
for p in prods:
    if p=='asics': still(p,IMG+p+'.jpg',d,0.08,'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920')
    else: still(p,IMG+p+'.jpg',d,0.08,'scale=940:-2,pad=1080:1920:(ow-iw)/2:(oh-ih)/2-60:white')
still('adidas',IMG+'adidas.jpg',10.4-9.23,0.06,'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920')
still('igpost',U+'6be89873-image.png',14.29-10.4,0.07,'scale=1080:-2,crop=1080:1920:0:120')
vid('page0',PH,0,16.6-14.29,'scale=1080:-2,crop=1080:1920:0:230')
for k,a,b in [('p1_0',16.6,18.32),('p1_1',18.32,19.3),('p1_2',19.3,20.0),('p1_3',20.0,20.9),('p1b_0',20.9,22.7),('p1b_1',22.7,25.1),
              ('p2_0',25.1,28.45),('p2_1',28.45,29.4),('p2_2',29.4,30.3),('p2_3',30.3,31.4),('p2_4',31.4,32.45)]:
    still(k,B+k+'.png',b-a)
dF=41.2-32.45; vid('page',PH,2.3,dF,'scale=1080:-2,crop=1080:1920:0:230',speed=(15.19-2.3)/dF)
vid('ipad',IP,0,45.1-41.2,'scale=1000:-2,pad=1080:1920:40:600:black',speed=2.0)
still('end',B+'end.png',END-45.1,0.06)
open(B+'list.txt','w').write(''.join(f"file '{os.path.basename(c)}'\n" for c in clips))
run(['-f','concat','-safe','0','-i',B+'list.txt','-c','copy',B+'base.mp4'])
# overlays
caps=json.load(open('captions.json'))
ov=[('top_hook',0,4.47),('stamp',12.97,14.29),('top_p3',32.6,35.6),('top_altura',41.2,45.1)]+[(f'cap_{i:02d}',c['s'],c['e']) for i,c in enumerate(caps)]
ins=[]; fc=''; last='0:v'
for i,(n,a,b) in enumerate(ov):
    ins+=['-i',B+n+'.png']; o=f'v{i}'
    fc+=f"[{last}][{i+1}:v]overlay=0:0:enable='between(t,{a},{b})'[{o}];"; last=o
ins+=['-i',AU]
run(['-i',B+'base.mp4']+ins+['-filter_complex',fc.rstrip(';'),'-map',f'[{last}]','-map',f'{len(ov)+1}:a',
     '-af','apad','-t',str(END),'-c:v','libx264','-preset','medium','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart','notfake-video.mp4'])
print('done')
