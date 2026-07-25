import { generateLevel, COLORS, getPathCells } from './levels.js';

let players = [];
try{
  const res = await fetch('assets/players.json');
  players = await res.json();
}catch(e){
  players = [{name:'Santi Cazorla', number:8, pos:'Mediocentro', desc:'Leyenda', color:'#00A3FF'}];
}

// --- SOUND ENGINE ---
class SoundEngine{
  constructor(){
    this.ctx=null;
    this.enabled = localStorage.getItem('sc_sound') !== 'off';
    this._initOnFirstGesture();
  }
  _initOnFirstGesture(){
    const init = ()=>{
      if(!this.ctx){
        this.ctx = new (window.AudioContext||window.webkitAudioContext)();
      }
      document.removeEventListener('pointerdown', init);
      document.removeEventListener('keydown', init);
    };
    document.addEventListener('pointerdown', init, {once:true});
    document.addEventListener('keydown', init, {once:true});
  }
  ensure(){
    if(!this.ctx) this.ctx = new (window.AudioContext||window.webkitAudioContext)();
    if(this.ctx.state==='suspended') this.ctx.resume();
  }
  tone({freq=440, freqEnd=freq, dur=0.2, type='sine', vol=0.25, slide=0}){
    if(!this.enabled || !this.ctx) return;
    this.ensure();
    const o=this.ctx.createOscillator();
    const g=this.ctx.createGain();
    o.type=type;
    o.frequency.setValueAtTime(freq, this.ctx.currentTime);
    if(slide||freqEnd!==freq){
      o.frequency.linearRampToValueAtTime(freqEnd, this.ctx.currentTime+dur);
    }
    g.gain.setValueAtTime(0, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(vol, this.ctx.currentTime+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime+dur);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(); o.stop(this.ctx.currentTime+dur);
  }
  playShoot(colorHex){
    // map color to freq for variety
    const map = {'#FF7A2F':500,'#2D9CFF':600,'#C6FF00':700,'#FF6EC7':800,'#00E676':550,'#FFEA00':650};
    const base = map[colorHex]||600;
    this.tone({freq:base, freqEnd:base*2.2, dur:0.25, type:'sine', vol:0.28});
    setTimeout(()=>this.tone({freq:base*1.5, freqEnd:base*2.8, dur:0.15, type:'triangle', vol:0.12}), 40);
  }
  playBlocked(){
    this.tone({freq:180, freqEnd:90, dur:0.35, type:'sawtooth', vol:0.35});
    if(navigator.vibrate) navigator.vibrate([60,30,60]);
  }
  playHint(){
    this.tone({freq:600, freqEnd:900, dur:0.2, type:'sine', vol:0.2});
    setTimeout(()=>this.tone({freq:900, freqEnd:1200, dur:0.2, type:'sine', vol:0.18}),120);
  }
  playWin(){
    [0,120,240,360].forEach((d,i)=>{
      setTimeout(()=>this.tone({freq:400+i*120, freqEnd:600+i*150, dur:0.4, type:'sine', vol:0.3}), d);
    });
    // crowd cheer-like noise
    setTimeout(()=>this.tone({freq:800, freqEnd:1200, dur:0.6, type:'triangle', vol:0.22}), 400);
  }
  playGameOver(){
    this.tone({freq:300, freqEnd:80, dur:0.8, type:'sawtooth', vol:0.32});
  }
  toggle(){
    this.enabled=!this.enabled;
    localStorage.setItem('sc_sound', this.enabled?'on':'off');
    return this.enabled;
  }
}

const sound = new SoundEngine();

const boardEl = document.getElementById('board');
const levelLabel = document.getElementById('levelLabel');
const livesEl = document.getElementById('lives');
const clearedLabel = document.getElementById('clearedLabel');
const percentLabel = document.getElementById('percentLabel');
const progressFill = document.getElementById('progressFill');
const winModal = document.getElementById('winModal');
const gameOverModal = document.getElementById('gameOverModal');
const unlockedList = document.getElementById('unlockedList');
const soundBtn = document.getElementById('soundBtn');

if(soundBtn){
  soundBtn.textContent = sound.enabled ? '🔊' : '🔇';
  soundBtn.addEventListener('click',()=>{
    const on = sound.toggle();
    soundBtn.textContent = on ? '🔊' : '🔇';
    if(on) sound.playShoot('#2D9CFF');
  });
}

let state = {
  level: parseInt(localStorage.getItem('sc_level')||'1'),
  lives:3,
  current: null,
  boardMap: null,
  removed:0,
  total:0,
  unlocked: JSON.parse(localStorage.getItem('sc_unlocked')||'[]'),
};

function save(){
  localStorage.setItem('sc_level', String(state.level));
  localStorage.setItem('sc_unlocked', JSON.stringify(state.unlocked));
}

function renderUnlocked(){
  if(state.unlocked.length===0){ unlockedList.textContent='Ninguno aún. ¡Completa el nivel 1!'; return; }
  unlockedList.innerHTML='';
  state.unlocked.forEach(name=>{
    const s=document.createElement('span');
    s.textContent=name;
    s.style.cssText='background:rgba(10,92,255,0.18);border:1px solid rgba(10,92,255,0.3);padding:4px 8px;border-radius:999px;font-size:11px;white-space:nowrap';
    unlockedList.appendChild(s);
  });
}

function initLevel(){
  const lvl = generateLevel(state.level);
  state.current=lvl;
  state.boardMap=lvl.board.map(row=>[...row]);
  state.removed=0;
  state.total=lvl.arrows.length;
  state.lives=3;
  updateHUD();
  renderBoard();
  updateProgress();
  // resize board to fit container
  requestAnimationFrame(()=>fitBoard());
}

function fitBoard(){
  const wrap = document.querySelector('.board-wrap');
  const available = wrap.clientWidth - 20; // padding
  const size = state.current.size;
  // each cell approx available/size, but ensure min 32px max 58px
  // board width 100% already, but we set height via aspect ratio
  boardEl.style.width = '100%';
  boardEl.style.maxWidth = available+'px';
}

window.addEventListener('resize', ()=>{ if(state.current) fitBoard(); });

function updateHUD(){
  levelLabel.textContent = `Nivel ${state.level}`;
  livesEl.textContent = '❤'.repeat(state.lives) + '♡'.repeat(3-state.lives);
  clearedLabel.textContent = `${state.removed} / ${state.total}`;
}

function updateProgress(){
  const pct = state.total? Math.round(state.removed/state.total*100):0;
  percentLabel.textContent=pct+'%';
  progressFill.style.width=pct+'%';
}

function renderBoard(){
  const size = state.current.size;
  boardEl.innerHTML='';
  boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  // NO fixed width here - CSS handles 100%
  for(let y=0;y<size;y++){
    for(let x=0;x<size;x++){
      const cell=document.createElement('div');
      cell.className='cell';
      cell.dataset.x=x; cell.dataset.y=y;
      const inner=document.createElement('div');
      inner.className='cell-inner';
      const arrow = state.boardMap[y][x];
      if(arrow){
        const aEl=document.createElement('div');
        aEl.className=`arrow ${['up','right','down','left'][arrow.dir]}`;
        aEl.dataset.id=arrow.id;
        aEl.style.color=arrow.color.hex;
        aEl.innerHTML=`<div class="arrow-body"><div class="arrow-shaft"></div><div class="arrow-head"></div></div>`;
        const shaft=aEl.querySelector('.arrow-shaft');
        shaft.style.background=arrow.color.hex;
        const head=aEl.querySelector('.arrow-head');
        const s= Math.max(10, Math.min(14, Math.floor( window.innerWidth<480 ? 10 : 14)));
        if(arrow.dir===0){
          head.style.borderLeft=s+'px solid transparent';
          head.style.borderRight=s+'px solid transparent';
          head.style.borderBottom='18px solid '+arrow.color.hex;
          head.style.top='2%'; head.style.left='50%'; head.style.transform='translateX(-50%)';
        }else if(arrow.dir===2){
          head.style.borderLeft=s+'px solid transparent';
          head.style.borderRight=s+'px solid transparent';
          head.style.borderTop='18px solid '+arrow.color.hex;
          head.style.bottom='2%'; head.style.left='50%'; head.style.transform='translateX(-50%)';
        }else if(arrow.dir===3){
          head.style.borderTop=s+'px solid transparent';
          head.style.borderBottom=s+'px solid transparent';
          head.style.borderRight='18px solid '+arrow.color.hex;
          head.style.left='2%'; head.style.top='50%'; head.style.transform='translateY(-50%)';
        }else{
          head.style.borderTop=s+'px solid transparent';
          head.style.borderBottom=s+'px solid transparent';
          head.style.borderLeft='18px solid '+arrow.color.hex;
          head.style.right='2%'; head.style.top='50%'; head.style.transform='translateY(-50%)';
        }
        aEl.addEventListener('click',()=>onArrowClick(arrow, aEl), {passive:true});
        aEl.addEventListener('touchstart',()=>showPreview(arrow), {passive:true});
        aEl.addEventListener('mouseenter',()=>showPreview(arrow));
        aEl.addEventListener('mouseleave',()=>clearPreview());
        inner.appendChild(aEl);
      }
      cell.appendChild(inner);
      boardEl.appendChild(cell);
    }
  }
}

let previewEls=[];
function showPreview(arrow){
  clearPreview();
  const size=state.current.size;
  const cells=getPathCells(arrow.x, arrow.y, arrow.dir, size);
  let blocked=false;
  let blocker=null;
  for(let c of cells){
    const occupant = state.boardMap[c.y][c.x];
    if(occupant){
      blocked=true;
      blocker=occupant;
      break;
    }
  }
  cells.forEach(c=>{
    const idx=c.y*size+c.x;
    const cellEl=boardEl.children[idx];
    if(!cellEl) return;
    const line=document.createElement('div');
    line.className='preview-line'+(blocked?' blocked':'');
    line.style.background = blocked ? '#ff3b3b' : arrow.color.hex;
    line.style.opacity = blocked ? '0.55' : '0.28';
    if(arrow.dir===0||arrow.dir===2){
      line.style.width='34%'; line.style.height='100%'; line.style.left='33%'; line.style.top='0';
    }else{
      line.style.height='34%'; line.style.width='100%'; line.style.top='33%'; line.style.left='0';
    }
    if(!blocked){
      line.style.background = arrow.color.hex;
      line.style.opacity='0.22';
    }
    cellEl.querySelector('.cell-inner').appendChild(line);
    previewEls.push(line);
  });
  if(blocker){
    const idx=blocker.y*size+blocker.x;
    const aEl=boardEl.children[idx]?.querySelector('.arrow');
    if(aEl) aEl.style.filter='brightness(1.8) drop-shadow(0 0 10px #ff3b3b)';
  }
}
function clearPreview(){
  previewEls.forEach(el=>el.remove());
  previewEls=[];
  boardEl.querySelectorAll('.arrow').forEach(a=>a.style.filter='');
}

function onArrowClick(arrow, el){
  if(el.classList.contains('exiting')) return;
  const size=state.current.size;
  const path=getPathCells(arrow.x, arrow.y, arrow.dir, size);
  let blocker=null;
  for(let c of path){
    const occ=state.boardMap[c.y][c.x];
    if(occ){ blocker=occ; break; }
  }
  if(blocker){
    el.classList.add('blocked');
    setTimeout(()=>el.classList.remove('blocked'), 400);
    state.lives--;
    updateHUD();
    sound.playBlocked();
    if(state.lives<=0){
      setTimeout(()=>{
        sound.playGameOver();
        gameOverModal.classList.add('open');
      }, 350);
    }
    return;
  }
  sound.playShoot(arrow.color.hex);
  el.classList.add('exiting');
  state.boardMap[arrow.y][arrow.x]=null;
  state.removed++;
  updateHUD();
  updateProgress();
  clearPreview();
  setTimeout(()=>{
    el.remove();
    if(state.removed>=state.total){
      sound.playWin();
      onLevelWin();
    }
  }, 380);
}

function onLevelWin(){
  const player = players[(state.level-1) % players.length];
  if(!state.unlocked.includes(player.name)){
    state.unlocked.push(player.name);
    save();
    renderUnlocked();
  }
  document.getElementById('playerName').textContent=player.name;
  document.getElementById('playerPos').textContent=`${player.pos} • Dorsal ${player.number}`;
  document.getElementById('playerDesc').textContent=player.desc;
  document.getElementById('playerBadge').textContent=`Nivel ${state.level} superado`;
  const avatar=document.getElementById('playerAvatar');
  avatar.textContent=player.name.split(' ').map(n=>n[0]).slice(0,2).join('');
  avatar.style.background=`linear-gradient(135deg, ${player.color}, #001a4d)`;
  createConfetti();
  winModal.classList.add('open');
  state.level++;
  save();
}

function createConfetti(){
  const modal = document.querySelector('#winModal .modal');
  for(let i=0;i<28;i++){
    const c=document.createElement('div');
    c.className='confetti';
    c.style.left=Math.random()*100+'%';
    c.style.top='-10px';
    c.style.background=COLORS[Math.floor(Math.random()*COLORS.length)].hex;
    modal.appendChild(c);
    c.animate([
      {transform:`translateY(0) rotate(0deg)`, opacity:1},
      {transform:`translateY(${220+Math.random()*200}px) translateX(${(Math.random()-0.5)*180}px) rotate(${720}deg)`, opacity:0}
    ], {duration:1100+Math.random()*700, easing:'cubic-bezier(.25,.8,.25,1)'}).onfinish=()=>c.remove();
  }
}

document.getElementById('nextBtn').addEventListener('click',()=>{
  winModal.classList.remove('open');
  initLevel();
});
document.getElementById('exitBtn').addEventListener('click',()=>{
  winModal.classList.remove('open');
  initLevel();
});
document.getElementById('retryBtn').addEventListener('click',()=>{
  gameOverModal.classList.remove('open');
  initLevel();
});
document.getElementById('retryFullBtn').addEventListener('click',()=>{
  gameOverModal.classList.remove('open');
  state.level=1;
  save();
  initLevel();
});
document.getElementById('restartBtn').addEventListener('click',()=>{ sound.tone({freq:400,dur:0.1,vol:0.15}); initLevel(); });
document.getElementById('hintBtn').addEventListener('click',()=>{
  const arrows=[];
  for(let y=0;y<state.current.size;y++) for(let x=0;x<state.current.size;x++) if(state.boardMap[y][x]) arrows.push(state.boardMap[y][x]);
  const clearArrows = arrows.filter(a=>{
    const path=getPathCells(a.x,a.y,a.dir,state.current.size);
    return path.every(c=>!state.boardMap[c.y][c.x]);
  });
  if(clearArrows.length){
    const pick=clearArrows[Math.floor(Math.random()*clearArrows.length)];
    const idx=pick.y*state.current.size+pick.x;
    const el=boardEl.children[idx]?.querySelector('.arrow');
    if(el) el.animate([{transform:'scale(1)'},{transform:'scale(1.25)'},{transform:'scale(1)'}], {duration:600, iterations:2});
    sound.playHint();
    showPreview(pick);
    setTimeout(clearPreview, 1000);
  }
});

renderUnlocked();
initLevel();
