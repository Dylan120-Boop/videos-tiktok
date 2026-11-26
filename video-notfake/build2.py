# Montaje animado: clips con zoom suave + transiciones xfade + capa de subtítulos animados + whooshes
import subprocess,os
U='/root/.claude/uploads/b9f0a0c7-1b9a-57e5-87c6-9f52ee4e0d77/'
TT=U+'c66312c6-ScreenRecording_11-25-2026_20-45-37_1.mp4'
PH=U+'2b74b0c0-ScreenRecording_11-25-2026_22-20-18_1.mp4'
IP=U+'1a4fea95-ScreenRecording_11-25-2026_22-20-42_1.mp4'
AU=U+'f2ffff98-ElevenLabs_2026-11-26T02_31_31_Dylan__eleven_v4.mp3'
IMG='/home/user/videos-tiktok/web/notfake/img/'
B='build/'; FR=B+'frames/'; FPS=30; END=53.2; TD=0.3; H=TD/2
def run(a): subprocess.run(['ffmpeg','-v','error','-y']+a,check=True)
ENC=['-an','-c:v','libx264','-preset','veryfast','-crf','17','-pix_fmt','yuv420p','-r',str(FPS)]
PUNCH="1+0.14*pow(1-min(on/14\\,1)\\,3)+0.05*on/{n}"
# (nombre, inicio, fin, tipo, fuente, transición hacia el siguiente)
S=[('hook',0,4.89,'vid',(TT,0,'crop=938:1668:725:0,scale=1080:1920'),'zoomin')]
prods=['jordan-canary','dunk-green','supreme-jacket','asics','fog-cap']; d=(9.23-4.89)/5
tr=['slideleft','slideup','slideleft','slideup','slideleft']
for i,p in enumerate(prods):
    pre='scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920' if p=='asics' else 'scale=940:-2,pad=1080:1920:(ow-iw)/2:(oh-ih)/2-60:white'
    S.append((p,4.89+i*d,4.89+(i+1)*d,'img',(IMG+p+'.jpg',pre),tr[i]))
S+=[('adidas',9.23,10.4,'img',(IMG+'adidas.jpg','scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920'),'smoothup'),
    ('igpost',10.4,14.29,'img',(U+'6be89873-image.png','scale=1080:-2,crop=1080:1920:0:120'),'zoomin'),
    ('page0',14.29,16.6,'vid',(PH,0.8,'scale=1080:-2,crop=1080:1920:0:230'),'slideup'),
    ('cards',16.6,32.45,'seq',(FR+'cards/f%05d.jpg',16.6),'circleopen'),
    ('page',32.45,41.2,'vid',(PH,2.3,'scale=1080:-2,crop=1080:1920:0:230',(15.19-2.3)/(41.2-32.45)),'slideleft'),
    ('ipad',41.2,45.1,'ipad',(IP,),'fadeblack'),
    ('end',45.1,END,'seq',(FR+'end/f%05d.jpg',45.1),None)]
clips=[]
for k,(n,s,e,typ,src,_) in enumerate(S):
    a=s-(H if k>0 else 0); b=e+(H if k<len(S)-1 else 0); L=b-a; N=int(round(L*FPS)); out=f'{B}x_{k:02d}_{n}.mp4'
    if typ=='img':
        img,pre=src
        run(['-loop','1','-i',img,'-vf',f"{pre},scale=2160:3840,zoompan=z='{PUNCH.format(n=N)}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps={FPS}",'-frames:v',str(N)]+ENC+[out])
    elif typ=='vid':
        f,ss,vf,*sp=src; sp=sp[0] if sp else 1.0; ss=max(0,ss-(s-a)*sp)
        z="scale=w='1080*(1+0.10*pow(1-min(t/0.5\\,1)\\,3))':h=-2:eval=frame,crop=1080:1920"
        run(['-ss',str(ss),'-t',str(L*sp+0.5),'-i',f,'-vf',f'setpts=PTS/{sp},{vf},{z},fps={FPS}','-t',str(L)]+ENC+[out])
    elif typ=='seq':
        pat,t0=src; pre=max(0,t0-a)
        run(['-framerate',str(FPS),'-i',pat,'-vf',f'tpad=start_duration={pre}:start_mode=clone:stop_duration=1:stop_mode=clone,fps={FPS}','-t',str(L)]+ENC+[out])
    elif typ=='ipad':
        run(['-f','lavfi','-i',f'color=black:s=1080x1920:r={FPS}:d={L}','-ss','0','-t',str(L*2+0.5),'-i',src[0],'-filter_complex',
             f"[1]setpts=PTS/2,scale=1000:-2,fps={FPS}[d];[0][d]overlay=x=40:y='600+700*pow(1-min(max(t-{H}\\,0)/0.55\\,1)\\,3)':shortest=1",'-t',str(L)]+ENC+[out])
    clips.append((out,L))
# Cadena xfade
ins=[];fc='';last='0:v'
for c,_ in clips: ins+=['-i',c]
for k in range(1,len(clips)):
    off=S[k][1]-H; o=f'x{k}'
    fc+=f"[{last}][{k}:v]xfade=transition={S[k-1][5]}:duration={TD}:offset={off:.3f}[{o}];"; last=o
# Capa de subtítulos animados (PNG con alfa)
n=len(clips)
ins+=['-framerate',str(FPS),'-i',FR+'ov/f%05d.png']
fc+=f"[{last}][{n}:v]overlay=0:0:format=auto[vout]"
# Audio: voz + whooshes en cada transición + golpe en el sello y en el logo
ins+=['-i',AU,'-i',B+'whoosh.wav','-i',B+'hit.wav']
ai=n+1; wi=n+2; hi=n+3
times=[S[k][1]-H for k in range(1,len(S))]
fc+=f";[{wi}]asplit={len(times)}"+''.join(f'[w{j}]' for j in range(len(times)))+';'
for j,t in enumerate(times): fc+=f"[w{j}]adelay={int(t*1000)}|{int(t*1000)}[wd{j}];"
fc+=f"[{hi}]asplit=2[h0][h1];[h0]adelay=12970|12970[hd0];[h1]adelay=45150|45150[hd1];"
fc+=f"[{ai}]aformat=channel_layouts=stereo,volume=1.0[voz];"
fc+="[voz]"+''.join(f'[wd{j}]' for j in range(len(times)))+f"[hd0][hd1]amix=inputs={len(times)+3}:duration=first:normalize=0,alimiter=limit=0.95,apad[aout]"
run(ins+['-filter_complex',fc,'-map','[vout]','-map','[aout]','-t',str(END),'-c:v','libx264','-preset','medium','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart','notfake-video.mp4'])
print('done')
