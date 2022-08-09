/// DO NOT MODIFY THIS
const tiles = Array.from(document.querySelectorAll('.tile'));
const playerDisplay = document.querySelector('.display-player');
const resetButton = document.querySelector('#reset');
const announcer = document.querySelector('.announcer');

tiles.forEach( (tile, index) => {
    tile.addEventListener('click', () => userAction(tile, index));
});

resetButton.addEventListener('click', resetBoard);
/// START CODE AFTER THIS
var current_player = 'X';
var board = [
    ['.','.','.'],
    ['.','.','.'],
    ['.','.','.']
]
var gameState = true;

function changePlayer(){
    if(current_player === 'X'){
        current_player = 'O';
        playerDisplay.innerText = 'O';
    }else{
        current_player = 'X';
        playerDisplay.innerText = 'X';
    }
}

function getEmptyBoard(){
    board = [
        ['.','.','.'],
        ['.','.','.'],
        ['.','.','.']
    ]
}

function getWinningPlayer(){
    var counterX = 0;
    var counterO = 0;
    var diag1 = '';
    var diag2 = '';
    for(var i = 0;i<board.length;i++){
        diag1 += board[i][i];
        diag2 += board[i][board.length-1-i];
        if(board[i].join('')==='XXX'){
            gameState = false;
            return 'X';
        }else if(board[i].join('')==='OOO'){
            gameState = false;
            return 'O';
        }
        for(var j = 0;j<board.length;j++){
            if(board[j][i] === 'X'){
                counterX++;
            }else if(board[j][i] === 'O'){
                counterO++;
            }
        }
        if(counterX === 3){
            gameState = false;
            return 'X'         
        }else if(counterO === 3){
            gameState = false;
            return 'O'         
        }
    }
    if(diag1 === 'XXX'||diag2 === 'XXX'){
        gameState = false;
        return 'X'
    }else if(diag1 === 'OOO'||diag2 === 'OOO'){
        gameState = false;
        return 'O'
    }
}

function isBoardFull(){
    return !board.includes('.')
}

function getPlayerMove(tile, input){
    var stIndex = Math.floor(input/3);
    var ndIndex = input%3;
    if(board[stIndex][ndIndex] === '.'){
        tile.innerText = current_player;
        board[stIndex][ndIndex] = current_player;
        changePlayer();
    }else{
        alert('Incorrect move! Please, try again.')
    }
}

function announce(){
    var player = getWinningPlayer();
    switch(player){
        case 'X':
            announcer.innerHTML = 'Player X has won!';
            break;
        case 'O':
            announcer.innerHTML = 'Player O has won!';
            break;
        case None:
            announcer.innerText = 'Tie!';
    }
    announcer.classList.remove('hide');
}

function userAction(x,y){
    getWinningPlayer();
    if(gameState){
        getPlayerMove(x,y);
        console.log(board);
    }  
}

function resetBoard(){
    tiles.forEach( tile => tile.innerText = '')
    if (current_player === "O"){
            current_player = "X";
            playerDisplay.innerText = 'X';
    }
    getEmptyBoard();
    gameState = true;
}
 

