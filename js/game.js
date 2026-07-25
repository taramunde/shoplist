const COLORS = [
  {name:'naranja', hex:'#FF7A2F'},
  {name:'azul', hex:'#2D9CFF'},
  {name:'lima', hex:'#C6FF00'},
  {name:'rosa', hex:'#FF6EC7'},
  {name:'verde', hex:'#00E676'},
  {name:'amarillo', hex:'#FFEA00'},
  {name:'cian', hex:'#00E5FF'},
  {name:'violeta', hex:'#7C4DFF'},
];
let players=[];
try{ const r=await fetch('assets/players.json'); players=await r.json(); }catch(e){ players=[{name:'Santi Cazorla', number:8, pos:'Mediocentro', desc:'Leyenda', color:'#00A3FF'}]; }

class SoundEngine{
  constructor(){
    this.ctx=null;
    this.enabled=localStorage.getItem('sc_sound')!=='off';
    const init=()=>{ if(!this.ctx) this.ctx=new (window.AudioContext||window.webkitAudioContext)(); document.removeEventListener('pointerdown',init); };
    document.addEventListener('pointerdown',init,{once:true});
  }
  ensure(){ if(!this.ctx) this.ctx=new (window.AudioContext||window.webkitAudioContext)(); if(this.ctx.state==='suspended') this.ctx.resume(); }
  tone({freq=440,freqEnd=freq,dur=0.2,type='sine',vol=0.25}){
    if(!this.enabled||!this.ctx) return; this.ensure();
    const o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,this.ctx.currentTime);
    if(freqEnd!==freq) o.frequency.linearRampToValueAtTime(freqEnd,this.ctx.currentTime+dur);
    g.gain.setValueAtTime(0,this.ctx.currentTime); g.gain.linearRampToValueAtTime(vol,this.ctx.currentTime+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001,this.ctx.currentTime+dur);
    o.connect(g); g.connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime+dur);
  }
  playShoot(hex){
    const map={'#FF7A2F':500,'#2D9CFF':600,'#C6FF00':700,'#FF6EC7':800,'#00E676':550,'#FFEA00':650,'#00E5FF':680,'#7C4DFF':580};
    const base=map[hex]||600;
    this.tone({freq:base,freqEnd:base*2.4,dur:0.28,type:'sine',vol:0.32});
    setTimeout(()=>this.tone({freq:base*1.6,freqEnd:base*3,dur:0.18,type:'triangle',vol:0.16}),50);
  }
  playBlocked(){
    this.tone({freq:220,freqEnd:80,dur:0.45,type:'sawtooth',vol:0.4});
    if(navigator.vibrate) navigator.vibrate([80,40,80]);
  }
  playWin(){
    [0,130,260,400].forEach((d,i)=>setTimeout(()=>this.tone({freq:400+i*130,freqEnd:600+i*160,dur:0.45,type:'sine',vol:0.32}),d));
    setTimeout(()=>this.tone({freq:900,freqEnd:1300,dur:0.7,type:'triangle',vol:0.24}),450);
  }
  playGameOver(){ this.tone({freq:320,freqEnd:60,dur:0.9,type:'sawtooth',vol:0.38}); }
  playHint(){
    this.tone({freq:600,freqEnd:900,dur:0.2,type:'sine',vol:0.22});
    setTimeout(()=>this.tone({freq:900,freqEnd:1200,dur:0.2,type:'sine',vol:0.2}),120);
  }
  toggle(){ this.enabled=!this.enabled; localStorage.setItem('sc_sound',this.enabled?'on':'off'); return this.enabled; }
}
const sound=new SoundEngine();

const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
const levelLabel=document.getElementById('levelLabel');
const clearedLabel=document.getElementById('clearedLabel');
const percentLabel=document.getElementById('percentLabel');
const movesLabel=document.getElementById('movesLabel');
const livesLabel=document.getElementById('lives');
const progressFill=document.getElementById('progressFill');
const winModal=document.getElementById('winModal');
const gameOverModal=document.getElementById('gameOverModal');
const unlockedList=document.getElementById('unlockedList');
const soundBtn=document.getElementById('soundBtn');

soundBtn.textContent=sound.enabled?'🔊':'🔇';
soundBtn.addEventListener('click',()=>{ const on=sound.toggle(); soundBtn.textContent=on?'🔊':'🔇'; if(on) sound.playShoot('#2D9CFF'); });

let state={
  level:parseInt(localStorage.getItem('sc_level')||'1'),
  paths:[], cols:0, rows:0, total:0, removed:0, moves:0, lives:3, animating:false,
  unlocked:JSON.parse(localStorage.getItem('sc_unlocked')||'[]'),
  cellW:20, cellH:20,
};

function save(){ localStorage.setItem('sc_level',String(state.level)); localStorage.setItem('sc_unlocked',JSON.stringify(state.unlocked)); }
function renderUnlocked(){
  if(state.unlocked.length===0){ unlockedList.textContent='Ninguno aún. ¡Limpia el primer laberinto!'; return; }
  unlockedList.innerHTML='';
  state.unlocked.forEach(n=>{
    const s=document.createElement('span');
    s.textContent=n;
    s.style.cssText='background:rgba(10,92,255,0.18);border:1px solid rgba(10,92,255,0.3);padding:4px 8px;border-radius:999px;font-size:11px;white-space:nowrap';
    unlockedList.appendChild(s);
  });
}

// GENERACIÓN MAX FILL + CHOQUE
function generateWindingLevel(levelNum){
  const baseCols=20+Math.min(levelNum*1.5,14); // 20..34
  const baseRows=28+Math.min(levelNum*2,18); // 28..46
  const cols=Math.floor(baseCols), rows=Math.floor(baseRows);
  const occupancy=Array.from({length:rows},()=>Array(cols).fill(0)); // cuenta de capas
  const paths=[];
  const targetPaths=Math.min(14+levelNum*4, 38); // nivel1 18, nivel10 38
  const dx=[0,1,0,-1], dy=[-1,0,1,0];
  let attempts=0;

  function createPath(){
    const edge=Math.floor(Math.random()*4);
    let sx,sy,dir;
    if(edge===0){ sx=Math.floor(1+Math.random()*(cols-2)); sy=0; dir=2; }
    else if(edge===2){ sx=Math.floor(1+Math.random()*(cols-2)); sy=rows-1; dir=0; }
    else if(edge===3){ sx=0; sy=Math.floor(1+Math.random()*(rows-2)); dir=1; }
    else{ sx=cols-1; sy=Math.floor(1+Math.random()*(rows-2)); dir=3; }
    // permite empezar aunque esté ocupado (para max fill, apilamos)
    const arrowDir=(dir+2)%4;
    const points=[{x:sx,y:sy}];
    let cx=sx,cy=sy,cdir=dir;
    const maxLen=22+Math.floor(Math.random()*28)+levelNum*3; // 22..50 + nivel => muy largo para llenar
    const minLen=12;
    for(let step=0; step<maxLen; step++){
      const candidates=[];
      for(let turn of [0,-1,1]){
        const nd=(cdir+turn+4)%4;
        const nx=cx+dx[nd], ny=cy+dy[nd];
        if(nx<0||nx>=cols||ny<0||ny>=rows) continue;
        // Evita volver atrás inmediato
        if(points.length>=2){
          const prev=points[points.length-2];
          if(prev.x===nx && prev.y===ny) continue;
        }
        // Para max fill, permitimos pisar ocupado, pero penalizamos si occupancy muy alta (>3) para no saturar un punto
        const occ=occupancy[ny][nx];
        const score = (turn===0?0:0.5) + occ*0.3 + Math.random()*0.2;
        candidates.push({nd,nx,ny,score});
      }
      if(candidates.length===0) break;
      candidates.sort((a,b)=>a.score-b.score);
      const pick=candidates[0];
      cx=pick.nx; cy=pick.ny; cdir=pick.nd;
      points.push({x:cx,y:cy});
    }
    if(points.length<minLen) return null;
    // marca occupancy
    points.forEach(p=>{ occupancy[p.y][p.x]++; });
    const color=COLORS[Math.floor(Math.random()*COLORS.length)];
    return {id:paths.length, points, color, arrowDir, edge, blockers:[], _removed:false};
  }

  while(paths.length<targetPaths && attempts<8000){
    attempts++;
    const p=createPath();
    if(p) paths.push(p);
  }

  // Espiral central extra para parecerse a foto y ocupar huecos
  const cx=Math.floor(cols/2), cy=Math.floor(rows/2);
  const maxRects=Math.min(6,2+Math.floor(levelNum/1.5));
  for(let r=0;r<maxRects;r++){
    const w=Math.max(4,Math.floor(cols*0.58 - r*3.2));
    const h=Math.max(4,Math.floor(rows*0.48 - r*3.2));
    if(w<4||h<4) continue;
    const x0=cx-Math.floor(w/2), y0=cy-Math.floor(h/2);
    const x1=x0+w, y1=y0+h;
    const points=[];
    for(let x=x0;x<=x1;x++) points.push({x,y:y0});
    for(let y=y0+1;y<=y1;y++) points.push({x:x1,y});
    for(let x=x1-1;x>=x0;x--) points.push({x,y:y1});
    for(let y=y1-1;y>y0;y--) points.push({x:x0,y});
    const gap=Math.floor(Math.random()*points.length);
    points.splice(gap,2);
    points.forEach(p=>{ if(p.x>=0&&p.x<cols&&p.y>=0&&p.y<rows) occupancy[p.y][p.x]++; });
    const color=COLORS[(r*3)%COLORS.length];
    paths.push({id:paths.length, points, color, arrowDir: (r%2===0?1:3), edge:-1, blockers:[], _removed:false, isCentral:true});
  }

  // Calcula blockers por capas: un camino está bloqueado por cualquier camino posterior que comparta celda
  const cellMap=new Map(); // key "x,y" -> lista de path ids que pasan por ahí en orden
  paths.forEach(p=>{
    p.points.forEach(pt=>{
      const key=pt.x+","+pt.y;
      if(!cellMap.has(key)) cellMap.set(key,[]);
      cellMap.get(key).push(p.id);
    });
  });
  // para cada path, blockers = paths con id mayor que comparten celda
  paths.forEach(p=>{
    const blockerSet=new Set();
    p.points.forEach(pt=>{
      const key=pt.x+","+pt.y;
      const list=cellMap.get(key)||[];
      list.forEach(id=>{ if(id>p.id) blockerSet.add(id); });
    });
    p.blockers=Array.from(blockerSet);
  });

  // Para debug, cuenta ocupación media
  let filled=0; for(let y=0;y<rows;y++) for(let x=0;x<cols;x++) if(occupancy[y][x]>0) filled++;
  const fillPct=Math.round(filled/(cols*rows)*100);

  return {cols,rows,paths,occupancy,fillPct};
}

function initLevel(){
  const lvl=generateWindingLevel(state.level);
  state.cols=lvl.cols; state.rows=lvl.rows; state.paths=lvl.paths;
  state.total=lvl.paths.length; state.removed=0; state.moves=0; state.lives=3; state.animating=false;
  console.log(`Nivel ${state.level} fill ${lvl.fillPct}% paths ${lvl.paths.length}`);
  resizeCanvas(); draw(); updateHUD();
}

function resizeCanvas(){
  const wrap=document.querySelector('.board-wrap');
  const maxW=wrap.clientWidth-12;
  const cellW=Math.floor(maxW/state.cols);
  const cellH=cellW;
  state.cellW=cellW; state.cellH=cellH;
  const dpr=window.devicePixelRatio||1;
  canvas.style.width=(cellW*state.cols)+'px';
  canvas.style.height=(cellH*state.rows)+'px';
  canvas.width=cellW*state.cols*dpr;
  canvas.height=cellH*state.rows*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener('resize',()=>{ if(state.cols){ resizeCanvas(); draw(); } });

function draw(){
  const {cellW,cellH,cols,rows,paths}=state;
  const W=cellW*cols, H=cellH*rows;
  ctx.fillStyle='#070a14';
  ctx.fillRect(0,0,W,H);
  // Dibuja en orden de generación (capas)
  paths.forEach(path=>{
    if(path._removed) return;
    const pts=path._animPoints||path.points;
    if(pts.length<2) return;
    const isBlocked=isPathBlocked(path);
    const alpha=isBlocked?0.55:1;
    ctx.save();
    ctx.globalAlpha=alpha;
    ctx.shadowBlur=isBlocked?6:16;
    ctx.shadowColor=path.color.hex;
    ctx.strokeStyle=path.color.hex;
    ctx.lineWidth=Math.max(4,cellW*0.42); // más grueso para ocupar más
    ctx.lineJoin='round'; ctx.lineCap='round';
    ctx.beginPath();
    ctx.moveTo(pts[0].x*cellW+cellW/2, pts[0].y*cellH+cellH/2);
    for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x*cellW+cellW/2, pts[i].y*cellH+cellH/2);
    ctx.stroke();
    ctx.shadowBlur=0;
    ctx.globalAlpha=alpha;
    ctx.strokeStyle=isBlocked?'rgba(255,80,80,0.9)':'rgba(255,255,255,0.92)';
    ctx.lineWidth=Math.max(1,cellW*0.10);
    ctx.beginPath();
    ctx.moveTo(pts[0].x*cellW+cellW/2, pts[0].y*cellH+cellH/2);
    for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x*cellW+cellW/2, pts[i].y*cellH+cellH/2);
    ctx.stroke();
    ctx.restore();
    // flecha
    const start=pts[0];
    drawArrowHead(start.x*cellW+cellW/2, start.y*cellH+cellH/2, path.arrowDir, path.color.hex, cellW, isBlocked);
  });
}

function drawArrowHead(x,y,dir,hex,cellW,isBlocked){
  const size=cellW*1.05;
  ctx.save(); ctx.translate(x,y);
  let ang=0;
  if(dir===0) ang=-Math.PI/2;
  if(dir===1) ang=0;
  if(dir===2) ang=Math.PI/2;
  if(dir===3) ang=Math.PI;
  ctx.rotate(ang);
  ctx.shadowBlur=isBlocked?4:12;
  ctx.shadowColor=isBlocked?'#ff5050':hex;
  ctx.fillStyle=isBlocked?'#ff5050':hex;
  ctx.beginPath();
  ctx.moveTo(size*0.58,0);
  ctx.lineTo(-size*0.38,-size*0.44);
  ctx.lineTo(-size*0.38,size*0.44);
  ctx.closePath(); ctx.fill();
  ctx.shadowBlur=0;
  ctx.fillStyle=isBlocked?'rgba(255,200,200,0.9)':'rgba(255,255,255,0.95)';
  ctx.beginPath();
  ctx.moveTo(size*0.34,0);
  ctx.lineTo(-size*0.16,-size*0.22);
  ctx.lineTo(-size*0.16,size*0.22);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function isPathBlocked(path){
  if(path._removed) return false;
  for(let bid of path.blockers){
    const b=state.paths[bid];
    if(b && !b._removed) return true;
  }
  return false;
}

function getPathAtPos(mx,my){
  const {cellW,cellH,paths}=state;
  const threshold=cellW*0.8;
  let best=null, bestDist=Infinity;
  for(let path of paths){
    if(path._removed||path._animating) continue;
    const pts=path.points;
    for(let i=0;i<pts.length-1;i++){
      const p1=pts[i], p2=pts[i+1];
      const x1=p1.x*cellW+cellW/2, y1=p1.y*cellH+cellH/2;
      const x2=p2.x*cellW+cellW/2, y2=p2.y*cellH+cellH/2;
      const d=distToSegment(mx,my,x1,y1,x2,y2);
      if(d<threshold && d<bestDist){ bestDist=d; best=path; }
    }
    const head=pts[0];
    const hx=head.x*cellW+cellW/2, hy=head.y*cellH+cellH/2;
    const dh=Math.hypot(mx-hx,my-hy);
    if(dh<cellW*1.2 && dh<bestDist){ bestDist=dh; best=path; }
  }
  return best;
}
function distToSegment(px,py,x1,y1,x2,y2){
  const A=px-x1, B=py-y1, C=x2-x1, D=y2-y1;
  const dot=A*C+B*D, len_sq=C*C+D*D;
  let param=-1; if(len_sq!==0) param=dot/len_sq;
  let xx,yy;
  if(param<0){xx=x1;yy=y1;} else if(param>1){xx=x2;yy=y2;} else{xx=x1+param*C;yy=y1+param*D;}
  return Math.hypot(px-xx,py-yy);
}

canvas.addEventListener('pointerdown',(e)=>{
  if(state.animating) return;
  const rect=canvas.getBoundingClientRect();
  const scaleX=(state.cellW*state.cols)/rect.width;
  const scaleY=(state.cellH*state.rows)/rect.height;
  const mx=(e.clientX-rect.left)*scaleX;
  const my=(e.clientY-rect.top)*scaleY;
  const path=getPathAtPos(mx,my);
  if(!path) return;
  if(isPathBlocked(path)){
    // choque
    state.lives--;
    updateHUD();
    sound.playBlocked();
    // animación shake del path
    const origColor=path.color.hex;
    path.color.hex='#ff3b3b';
    draw();
    setTimeout(()=>{ path.color.hex=origColor; draw(); }, 250);
    if(state.lives<=0){
      setTimeout(()=>{ sound.playGameOver(); gameOverModal.classList.add('open'); }, 300);
    }
    return;
  }
  removePathAnimated(path);
});

function removePathAnimated(path){
  if(path._animating) return;
  path._animating=true; state.animating=true;
  sound.playShoot(path.color.hex);
  state.moves++;
  const pts=path.points;
  let curIdx=pts.length-1;
  const speed=0.32+Math.random()*0.15;
  function frame(){
    curIdx-=speed;
    if(curIdx<=0){
      path._removed=true; path._animating=false; state.removed++; state.animating=false;
      updateHUD(); draw();
      if(state.removed>=state.total) setTimeout(onWin,300);
      return;
    }
    const visibleCount=Math.floor(curIdx);
    const frac=curIdx-visibleCount;
    const visible=pts.slice(0,visibleCount+1);
    if(visible.length>=1 && frac>0 && visibleCount+1<pts.length){
      const a=pts[visibleCount], b=pts[visibleCount+1];
      visible[visible.length-1]={x:a.x + (b.x-a.x)*frac, y:a.y + (b.y-a.y)*frac};
    }
    path._animPoints=visible;
    draw();
    const tail=visible[visible.length-1];
    if(tail){
      ctx.save(); ctx.shadowBlur=20; ctx.shadowColor=path.color.hex; ctx.fillStyle='#ffffff';
      ctx.beginPath();
      ctx.arc(tail.x*state.cellW+state.cellW/2, tail.y*state.cellH+state.cellH/2, state.cellW*0.32,0,Math.PI*2);
      ctx.fill(); ctx.restore();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function updateHUD(){
  levelLabel.textContent=`Nivel ${state.level}`;
  clearedLabel.textContent=`${state.removed} / ${state.total}`;
  const pct=state.total? Math.round(state.removed/state.total*100):0;
  percentLabel.textContent=pct+'%';
  progressFill.style.width=pct+'%';
  movesLabel.textContent=`${state.moves} mov`;
  livesLabel.textContent='❤'.repeat(state.lives)+'♡'.repeat(3-state.lives);
  livesLabel.style.color=state.lives===1?'#ff3b3b':state.lives===2?'#ffb347':'#ff6b6b';
}

function onWin(){
  sound.playWin();
  const player=players[(state.level-1)%players.length];
  if(!state.unlocked.includes(player.name)){ state.unlocked.push(player.name); save(); renderUnlocked(); }
  document.getElementById('playerName').textContent=player.name;
  document.getElementById('playerPos').textContent=`${player.pos} • Dorsal ${player.number}`;
  document.getElementById('playerDesc').textContent=player.desc;
  document.getElementById('playerBadge').textContent=`Nivel ${state.level} superado • ${state.moves} movs • 3❤`;
  const av=document.getElementById('playerAvatar');
  av.textContent=player.name.split(' ').map(n=>n[0]).slice(0,2).join('');
  av.style.background=`linear-gradient(135deg, ${player.color}, #001a4d)`;
  winModal.classList.add('open');
  state.level++; save();
}

document.getElementById('nextBtn').addEventListener('click',()=>{ winModal.classList.remove('open'); initLevel(); });
document.getElementById('exitBtn').addEventListener('click',()=>{ winModal.classList.remove('open'); initLevel(); });
document.getElementById('restartBtn').addEventListener('click',()=>{ initLevel(); });
document.getElementById('hintBtn').addEventListener('click',()=>{
  const remaining=state.paths.filter(p=>!p._removed && !isPathBlocked(p));
  const target = remaining.length? remaining[Math.floor(Math.random()*remaining.length)] : state.paths.filter(p=>!p._removed)[0];
  if(!target) return;
  const orig=target.color.hex;
  let blinks=0;
  const iv=setInterval(()=>{
    target.color.hex = blinks%2===0 ? '#ffffff' : orig;
    draw();
    blinks++;
    if(blinks>6){ clearInterval(iv); target.color.hex=orig; draw(); }
  },120);
  sound.playHint();
});
document.getElementById('retryBtn')?.addEventListener('click',()=>{ gameOverModal.classList.remove('open'); initLevel(); });
document.getElementById('retryFullBtn')?.addEventListener('click',()=>{ gameOverModal.classList.remove('open'); state.level=1; save(); initLevel(); });

renderUnlocked();
initLevel();
