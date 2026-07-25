export const COLORS = [
  {name:'naranja', hex:'#FF7A2F'},
  {name:'azul', hex:'#2D9CFF'},
  {name:'lima', hex:'#C6FF00'},
  {name:'rosa', hex:'#FF6EC7'},
  {name:'verde', hex:'#00E676'},
  {name:'amarillo', hex:'#FFEA00'},
];

export function generateLevel(levelNum){
  const size = Math.min(6 + Math.floor(levelNum/2), 11);
  const targetArrows = Math.min(5 + levelNum*2, Math.floor(size*size*0.55));
  const board = Array.from({length:size}, ()=>Array(size).fill(null));
  const arrows = [];
  let attempts = 0;
  const maxAttempts = 2000;

  function isPathClear(x,y,dir, boardState){
    const dx=[0,1,0,-1], dy=[-1,0,1,0];
    let cx=x+dx[dir], cy=y+dy[dir];
    while(cx>=0 && cx<size && cy>=0 && cy<size){
      if(boardState[cy][cx] !== null) return false;
      cx+=dx[dir]; cy+=dy[dir];
    }
    return true;
  }

  while(arrows.length < targetArrows && attempts < maxAttempts){
    attempts++;
    const x = Math.floor(Math.random()*size);
    const y = Math.floor(Math.random()*size);
    if(board[y][x] !== null) continue;
    // prefer directions with longer path for difficulty
    let dirs=[0,1,2,3].sort(()=>Math.random()-0.5);
    let placed=false;
    for(let dir of dirs){
      if(isPathClear(x,y,dir,board)){
        const color = COLORS[Math.floor(Math.random()*COLORS.length)];
        const arrow={id:arrows.length, x,y,dir, color, placedOrder:arrows.length};
        board[y][x]=arrow;
        arrows.push(arrow);
        placed=true;
        break;
      }
    }
  }
  // If we couldn't place enough, reduce but keep solvable
  // arrows already have solvable order = reverse placement
  const solutionOrder = [...arrows].reverse().map(a=>a.id);
  return {size, arrows, solutionOrder, board};
}

export function getPathCells(x,y,dir,size){
  const cells=[];
  const dx=[0,1,0,-1], dy=[-1,0,1,0];
  let cx=x+dx[dir], cy=y+dy[dir];
  while(cx>=0 && cx<size && cy>=0 && cy<size){
    cells.push({x:cx,y:cy});
    cx+=dx[dir]; cy+=dy[dir];
  }
  return cells;
}
