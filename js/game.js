// game.js
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 400;

        this.levelIndex = 0;
        this.currentLevel = null;
        this.board = [];
        this.rows = 6;
        this.cols = 6;
        this.cellSize = this.canvas.width / this.cols;
        this.isPlaying = false;
        this.hearts = 3;
        this.maxHearts = 3;

        // Elementos UI
        this.levelDisplay = document.getElementById('level-display');
        this.heartsDisplay = document.getElementById('hearts-display');
        this.playerImg = document.getElementById('player-img');
        this.playerNameDisplay = document.getElementById('player-name');
        this.completedLevelDisplay = document.getElementById('completed-level');

        // Eventos
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('next-level-btn').addEventListener('click', () => this.nextLevel());
        document.getElementById('exit-btn').addEventListener('click', () => this.exitGame());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetLevel());
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
    }

    startGame() {
        document.getElementById('menu-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'flex';
        this.levelIndex = 0;
        this.hearts = this.maxHearts;
        this.loadLevel();
    }

    loadLevel() {
        if (this.levelIndex >= LEVELS.length) {
            alert('¡Has completado todos los niveles! 🎉');
            this.exitGame();
            return;
        }
        this.currentLevel = LEVELS[this.levelIndex];
        // Crear una copia profunda del tablero
        this.board = this.currentLevel.board.map(row => [...row]);
        this.isPlaying = true;
        this.levelDisplay.textContent = `Nivel ${this.currentLevel.id}`;
        this.updateHearts();
        this.draw();
        document.getElementById('level-complete').style.display = 'none';
        document.getElementById('game-screen').style.display = 'flex';
    }

    resetLevel() {
        if (this.currentLevel) {
            this.board = this.currentLevel.board.map(row => [...row]);
            this.hearts = this.maxHearts;
            this.updateHearts();
            this.draw();
        }
    }

    draw() {
        const ctx = this.ctx;
        const size = this.cellSize;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar grid
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const x = c * size;
                const y = r * size;
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, size, size);

                const val = this.board[r][c];
                if (val === 0) continue;

                // Dibujar flecha
                ctx.fillStyle = '#f5c842';
                ctx.shadowColor = '#f5c842';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                const cx = x + size/2;
                const cy = y + size/2;
                const arrowSize = size * 0.35;

                switch(val) {
                    case 1: // Arriba
                        ctx.moveTo(cx, cy - arrowSize);
                        ctx.lineTo(cx - arrowSize, cy + arrowSize);
                        ctx.lineTo(cx + arrowSize, cy + arrowSize);
                        break;
                    case 2: // Abajo
                        ctx.moveTo(cx, cy + arrowSize);
                        ctx.lineTo(cx - arrowSize, cy - arrowSize);
                        ctx.lineTo(cx + arrowSize, cy - arrowSize);
                        break;
                    case 3: // Izquierda
                        ctx.moveTo(cx - arrowSize, cy);
                        ctx.lineTo(cx + arrowSize, cy - arrowSize);
                        ctx.lineTo(cx + arrowSize, cy + arrowSize);
                        break;
                    case 4: // Derecha
                        ctx.moveTo(cx + arrowSize, cy);
                        ctx.lineTo(cx - arrowSize, cy - arrowSize);
                        ctx.lineTo(cx - arrowSize, cy + arrowSize);
                        break;
                }
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }

    handleClick(event) {
        if (!this.isPlaying) return;
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const mouseX = (event.clientX - rect.left) * scaleX;
        const mouseY = (event.clientY - rect.top) * scaleY;

        const col = Math.floor(mouseX / this.cellSize);
        const row = Math.floor(mouseY / this.cellSize);

        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return;

        const dir = this.board[row][col];
        if (dir === 0) return;

        // Intentar mover la flecha
        if (this.moveArrow(row, col, dir)) {
            this.draw();
            if (this.checkWin()) {
                this.endLevel();
            }
        } else {
            // Colisión: perder una vida
            this.hearts--;
            this.updateHearts();
            if (this.hearts <= 0) {
                alert('💔 Sin vidas. ¡Reinicia el nivel!');
                this.resetLevel();
            } else {
                // Opcional: feedback visual de error
                this.draw();
            }
        }
    }

    moveArrow(row, col, dir) {
        let dr = 0, dc = 0;
        switch(dir) {
            case 1: dr = -1; break; // Arriba
            case 2: dr = 1; break;  // Abajo
            case 3: dc = -1; break; // Izquierda
            case 4: dc = 1; break;  // Derecha
        }

        let newRow = row + dr;
        let newCol = col + dc;

        // Buscar el espacio vacío más lejano en esa dirección
        while (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
            if (this.board[newRow][newCol] !== 0) {
                // Hay una flecha en el camino -> colisión
                return false;
            }
            newRow += dr;
            newCol += dc;
        }

        // Movimiento válido: la flecha se mueve a la última posición vacía
        const lastRow = newRow - dr;
        const lastCol = newCol - dc;
        this.board[row][col] = 0;
        this.board[lastRow][lastCol] = dir;
        return true;
    }

    checkWin() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c] !== 0) return false;
            }
        }
        return true;
    }

    updateHearts() {
        this.heartsDisplay.textContent = '❤️ '.repeat(this.hearts).trim();
    }

    endLevel() {
        this.isPlaying = false;
        document.getElementById('game-screen').style.display = 'none';
        const completeScreen = document.getElementById('level-complete');
        completeScreen.style.display = 'flex';

        const level = this.currentLevel;
        this.playerImg.src = level.image;
        this.playerImg.onerror = () => {
            this.playerImg.style.display = 'none';
            this.playerNameDisplay.textContent = level.playerName;
        };
        this.playerNameDisplay.textContent = level.playerName;
        this.completedLevelDisplay.textContent = level.id;

        if (this.levelIndex >= LEVELS.length - 1) {
            document.getElementById('next-level-btn').textContent = '🏆 ¡Finalizar!';
        } else {
            document.getElementById('next-level-btn').textContent = '➡️ Siguiente Nivel';
        }
    }

    nextLevel() {
        this.levelIndex++;
        this.hearts = this.maxHearts;
        this.loadLevel();
    }

    exitGame() {
        this.isPlaying = false;
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('level-complete').style.display = 'none';
        document.getElementById('menu-screen').style.display = 'flex';
        this.levelIndex = 0;
    }

    showHint() {
        // Pista simple: resalta una flecha que se pueda mover
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const dir = this.board[r][c];
                if (dir === 0) continue;
                // Simular movimiento para ver si es válido
                let dr = 0, dc = 0;
                switch(dir) {
                    case 1: dr = -1; break;
                    case 2: dr = 1; break;
                    case 3: dc = -1; break;
                    case 4: dc = 1; break;
                }
                let newRow = r + dr;
                let newCol = c + dc;
                let canMove = true;
                while (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
                    if (this.board[newRow][newCol] !== 0) {
                        canMove = false;
                        break;
                    }
                    newRow += dr;
                    newCol += dc;
                }
                if (canMove) {
                    // Resaltar la celda (dibujar un borde)
                    const ctx = this.ctx;
                    const size = this.cellSize;
                    const x = c * size;
                    const y = r * size;
                    ctx.strokeStyle = '#00ff00';
                    ctx.lineWidth = 4;
                    ctx.strokeRect(x, y, size, size);
                    return;
                }
            }
        }
        alert('No hay movimientos disponibles. ¡Reinicia el nivel!');
    }
          }
