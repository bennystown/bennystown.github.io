import glob,subprocess,sys
fs=sorted(glob.glob('/tmp/ep9/st_*.jpg'))
args=[];[args.extend(['-i',f]) for f in fs]
n=len(fs); cols=4; rows=(n+cols-1)//cols
flt=''.join(f'[{i}]scale=270:480[s{i}];' for i in range(n))
for r in range(rows):
    row=fs[r*cols:(r+1)*cols]; k=len(row)
    flt+=''.join(f'[s{r*cols+j}]' for j in range(k))+(f'hstack={k}[r{r}];' if k>1 else f'null[r{r}];')
flt+=''.join(f'[r{r}]' for r in range(rows))+(f'vstack={rows}' if rows>1 else 'null')
subprocess.run(['ffmpeg','-y','-loglevel','error',*args,'-filter_complex',flt,'/tmp/ep9/sheet.jpg'],check=True)
