
import { generateLevel, COLORS, getPathCells } from './levels.js';

let players = [];
try{
  const res = await fetch('assets/players.json');
  players = await res.json();
}catch(e){
  players = [{name:'Santi Cazorla', number:8, pos:'Mediocentro', desc:'Leyenda', color:'#00A3FF'}];
}

const boardEl = document.getElementById('board');
const levelLabel = document.getElementById('levelLabel');
const livesEl = document.getElementById('lives');
const clearedLabel = document.getElementById('clearedLabel');
const percentLabel = document.getElementById('percentLabel');
const progressFill = document.getElementById('progressFill');
const winModal = document.getElementById('winModal');
const gameOverModal = document.getElementById('gameOverModal');
const unlockedList = document.getElementById('unlockedList');

let state = {
  level: parseInt(localStorage.getItem('sc_level')||'1'),
  lives:3,
  current: null,
  boardMap: null, // 2D array of arrow or null
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
    s.style.cssText='background:rgba(10,92,255,0.18);border:1px solid rgba(10,92,255,0.3);padding:4px 8px;border-radius:999px;font-size:11px';
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
}

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
  boardEl.style.width = `min(92vw, ${size*58}px)`;
  // create cells
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
        aEl.innerHTML=`<div class="arrow-body"><div class="arrow-shaft" style="background:${arrow.color.hex}"></div><div class="arrow-head" style="border-${['bottom','left','top','right'][arrow.dir]}-color:${arrow.color.hex}"></div></div>`;
        // For left/right etc we used inline border trick but need correct handling via CSS, we will set via style
        const head = aEl.querySelector('.arrow-head');
        // Reset borders
        head.style.border='none';
        const s=14;
        if(arrow.dir===0){ // up
          head.style.borderLeft=s+'px solid transparent';
          head.style.borderRight=s+'px solid transparent';
          head.style.borderBottom='18px solid '+arrow.color.hex;
        }else if(arrow.dir===2){
          head.style.borderLeft=s+'px solid transparent';
          head.style.borderRight=s+'px solid transparent';
          head.style.borderTop='18px solid '+arrow.color.hex;
        }else if(arrow.dir===3){
          head.style.borderTop=s+'px solid transparent';
          head.style.borderBottom=s+'px solid transparent';
          head.style.borderRight='18px solid '+arrow.color.hex;
        }else{
          head.style.borderTop=s+'px solid transparent';
          head.style.borderBottom=s+'px solid transparent';
          head.style.borderLeft='18px solid '+arrow.color.hex;
        }
        aEl.addEventListener('click',()=>onArrowClick(arrow, aEl));
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
  for(let c of cells){
    const occupant = state.boardMap[c.y][c.x];
    if(occupant){
      blocked=true;
      break;
    }
  }
  cells.forEach(c=>{
    const idx=c.y*size+c.x;
    const cellEl=boardEl.children[idx];
    const line=document.createElement('div');
    line.className='preview-line'+(blocked?' blocked':'');
    // orientation
    if(arrow.dir===0||arrow.dir===2){
      line.style.width='34%'; line.style.height='100%'; line.style.left='33%'; line.style.top='0';
      line.style.background = blocked ? '#ff3b3b' : arrow.color.hex;
      line.style.opacity = blocked ? '0.6' : '0.28';
    }else{
      line.style.height='34%'; line.style.width='100%'; line.style.top='33%'; line.style.left='0';
      line.style.background = blocked ? '#ff3b3b' : arrow.color.hex;
      line.style.opacity = blocked ? '0.6' : '0.28';
    }
    if(!blocked){
      line.style.background = `repeating-linear-gradient(${arrow.dir%2===0?'0deg':'90deg'}, ${arrow.color.hex} 0 6px, transparent 6px 10px)`;
    }
    cellEl.querySelector('.cell-inner').appendChild(line);
    previewEls.push(line);
  });
  if(blocked){
    // highlight blocking arrow
    for(let c of cells){
      const occ=state.boardMap[c.y][c.x];
      if(occ){
        const idx=c.y*size+c.x;
        const aEl=boardEl.children[idx].querySelector('.arrow');
        if(aEl) aEl.style.filter='brightness(1.8) drop-shadow(0 0 10px #ff3b3b)';
        break;
      }
    }
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
    // fail
    el.classList.add('blocked');
    setTimeout(()=>el.classList.remove('blocked'), 400);
    state.lives--;
    updateHUD();
    // haptic
    if(navigator.vibrate) navigator.vibrate(120);
    if(state.lives<=0){
      setTimeout(()=>gameOverModal.classList.add('open'), 400);
    }
    return;
  }
  // success
  el.classList.add('exiting');
  // remove from boardMap immediately after animation
  state.boardMap[arrow.y][arrow.x]=null;
  state.removed++;
  updateHUD();
  updateProgress();
  clearPreview();
  setTimeout(()=>{
    el.remove();
    if(state.removed>=state.total){
      onLevelWin();
    }
  }, 380);
}

function onLevelWin(){
  const player = players[(state.level-1) % players.length];
  // unlock
  if(!state.unlocked.includes(player.name)){
    state.unlocked.push(player.name);
    save();
    renderUnlocked();
  }
  // fill modal
  document.getElementById('playerName').textContent=player.name;
  document.getElementById('playerPos').textContent=`${player.pos} • Dorsal ${player.number}`;
  document.getElementById('playerDesc').textContent=player.desc;
  document.getElementById('playerBadge').textContent=`Nivel ${state.level} superado`;
  const avatar=document.getElementById('playerAvatar');
  avatar.textContent=player.name.split(' ').map(n=>n[0]).slice(0,2).join('');
  avatar.style.background=`linear-gradient(135deg, ${player.color}, #001a4d)`;
  // confetti
  createConfetti();
  winModal.classList.add('open');
  state.level++;
  save();
}

function createConfetti(){
  const modal = document.querySelector('#winModal .modal');
  for(let i=0;i<30;i++){
    const c=document.createElement('div');
    c.className='confetti';
    c.style.left=Math.random()*100+'%';
    c.style.top='-10px';
    c.style.background=COLORS[Math.floor(Math.random()*COLORS.length)].hex;
    c.style.transform=`rotate(${Math.random()*360}deg)`;
    modal.appendChild(c);
    c.animate([
      {transform:`translateY(0) rotate(0deg)`, opacity:1},
      {transform:`translateY(${200+Math.random()*200}px) translateX(${(Math.random()-0.5)*200}px) rotate(${720}deg)`, opacity:0}
    ], {duration:1200+Math.random()*800, easing:'cubic-bezier(.25,.8,.25,1)'}).onfinish=()=>c.remove();
  }
}

// controls
document.getElementById('nextBtn').addEventListener('click',()=>{
  winModal.classList.remove('open');
  initLevel();
});
document.getElementById('exitBtn').addEventListener('click',()=>{
  winModal.classList.remove('open');
  // stay on next level but show message? just go to start screen logic
  initLevel();
});
document.getElementById('retryBtn').addEventListener('click',()=>{
  gameOverModal.classList.remove('open');
  // reset same level (decrement because we incremented on win only, so level stays)
  initLevel();
});
document.getElementById('retryFullBtn').addEventListener('click',()=>{
  gameOverModal.classList.remove('open');
  state.level=1;
  save();
  initLevel();
});
document.getElementById('restartBtn').addEventListener('click',()=>initLevel());
document.getElementById('hintBtn').addEventListener('click',()=>{
  // find any clear arrow
  const arrows=[];
  for(let y=0;y<state.current.size;y++) for(let x=0;x<state.current.size;x++) if(state.boardMap[y][x]) arrows.push(state.boardMap[y][x]);
  const clearArrows = arrows.filter(a=>{
    const path=getPathCells(a.x,a.y,a.dir,state.current.size);
    return path.every(c=>!state.boardMap[c.y][c.x]);
  });
  if(clearArrows.length){
    const pick=clearArrows[Math.floor(Math.random()*clearArrows.length)];
    const idx=pick.y*state.current.size+pick.x;
    const el=boardEl.children[idx].querySelector('.arrow');
    el.animate([{transform:'scale(1)'},{transform:'scale(1.25)'},{transform:'scale(1)'}], {duration:600, iterations:2});
  }
});

// init
renderUnlocked();
initLevel();
