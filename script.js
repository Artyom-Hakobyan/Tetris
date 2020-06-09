let cell = document.getElementById("tetris");
let ctx = cell.getContext("2d");

const row = 20;
const col = 10;
const sq = 25;
const empty = "white"; 

// Draw a square

function drawSquare(x, y, color){
    ctx.fillStyle = color;
    ctx.fillRect(x*sq, y*sq, sq, sq);

    ctx.strokeStyle = "black";
    ctx.strokeRect(x*sq, y*sq, sq, sq);
}

// Board creation

let board = [];
for (let r = 0; r < row; r++){
    board[r] = [];
    for (let c = 0; c < col; c++){
        board[r][c] = empty;
    }
}

// Draw the board

function drawBoard(){
    for (let r = 0; r < row; r++){
        for (let c = 0; c < col; c++){
            drawSquare(c, r, board[r][c]);
        }
    }
}

drawBoard();

// Tetrominoes

const Z = [
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
    ]
]

const S = [
	[
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 1],
		[0, 0, 1]
	],
	[
		[0, 0, 0],
		[0, 1, 1],
		[1, 1, 0]
	],
	[
		[1, 0, 0],
		[1, 1, 0],
		[0, 1, 0]
	]
];

const T = [
	[
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 1, 0],
		[1, 1, 0],
		[0, 1, 0]
	]
];

const O = [
	[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0],
	]
];

const L = [
	[
		[0, 0, 1],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 1]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[1, 0, 0]
	],
	[
		[1, 1, 0],
		[0, 1, 0],
		[0, 1, 0]
	]
];

const I = [
	[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	],
	[
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
	],
	[
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
	]
];

const J = [
	[
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 1],
		[0, 1, 0],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 1]
	],
	[
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 0]
	]
];

const tetrominoes = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];

// Random Tetromino Generator

function randomPiece(){
    let r = randomN = Math.floor(Math.random() * tetrominoes.length) // 0 -> 6
    return new Piece( tetrominoes[r][0], tetrominoes[r][1]);
}

let p = randomPiece();

// The Object Piece

function Piece(tetromino, color){
    this.tetromino = tetromino;
    this.color = color;
    
    this.tetrominoN = 0; 
    this.activeTetromino = this.tetromino[this.tetrominoN];
    
    // Above the top of the Border
    this.x = 3;
    this.y = -2;
}

// Fill function

Piece.prototype.fill = function(color){
    for( let r = 0; r < this.activeTetromino.length; r++){
        for(let c = 0; c < this.activeTetromino.length; c++){
            if( this.activeTetromino[r][c]){
                drawSquare(this.x + c,this.y + r, color);
            }
        }
    }
}

// Draw

Piece.prototype.draw = function(){
    this.fill(this.color);
}

// Undraw

Piece.prototype.unDraw = function(){
    this.fill(empty);
}

// Move Down

Piece.prototype.moveDown = function(){
    if (!this.collision(0,1,this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = randomPiece();
    }
    
}

// Move Right

Piece.prototype.moveRight = function(){
    if (!this.collision(1,0,this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// Move Left

Piece.prototype.moveLeft = function(){
    if (!this.collision(-1,0,this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// Rotate

Piece.prototype.rotate = function() {
    let rotatePiece = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;

    if (this.collision(0, 0, rotatePiece)) {
        if (this.x > col / 2) {                            // Right Wall
            kick = -1
        } else if (this.x < col / 2) {                     // Left Wall
            kick = 1
        }
    }

    if (!this.collision(kick, 0, rotatePiece)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

// Collision Detection Function

Piece.prototype.collision = function(x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece.length; c++) {
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            if (!piece[r][c]) {
                continue;
            } else if (newX < 0 || newX >= col || newY >= row) {
                return true;
            } else if (newY < 0) {
                continue;
            } else if (board[newY][newX] != empty) {
                return true;
            }
        }
    }
    return false;
}


// Lock and Remove Full Row

Piece.prototype.lock = function() {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            if (!this.activeTetromino[r][c]) {
                continue;
            } else if (this.y + r < 0) {
                alert('Game Over!')
                gameOver = true;
                break;
            }
            board[this.y + r][this.x + c] = this.color;
        }
    }
    // Remove Occupied Rows
    for (let r = 0; r < row; r++) {
        let isRowFull = true;
        for (let c = 0; c < col; c++){
            isRowFull = isRowFull && (board[r][c] != empty);
        }
        if (isRowFull) {
            for (let y = r; y > 1; y--){
                for (let c = 0; c < col; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            for (let c = 0; c < col; c++){
                board[0][c] = empty;
            }
        }
    }
    drawBoard();
}

// Keycodes

document.addEventListener("keydown", arrowKeys);

function arrowKeys(event) {
    if (event.keyCode == 37) {
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.keyCode == 38) {
        p.rotate();
        dropStart = Date.now();
    } else if (event.keyCode == 39) {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.keyCode == 40) {
        p.moveDown();
    }
}

// Drop

let dropStart = Date.now();
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 700){
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver){
        requestAnimationFrame(drop);
    }
}

drop();