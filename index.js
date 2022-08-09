/// DO NOT MODIFY THIS
const tiles = Array.from(document.querySelectorAll('.tile'));
const playerDisplay = document.querySelector('.display-player');
const resetButton = document.querySelector('#reset');
const announcer = document.querySelector('.announcer');
const randomButton = document.querySelector('#random');
const unbeatableButton = document.querySelector('#unbeatable');
const humanButton = document.querySelector('#human');

tiles.forEach( (tile, index) => {
    tile.addEventListener('click', () => userAction(tile, index));
});

resetButton.addEventListener('click', resetBoard);
randomButton.addEventListener('click', chooseRandom);
unbeatableButton.addEventListener('click', chooseUnbeatable);
humanButton.addEventListener('click', chooseHuman);

/// START CODE AFTER THIS

// importing the functions from minimax.js file as it was bothersome to write it here and test it in the same time
// const minimax = require("./minimax");

var current_player = 'X';
var board = [
    ['.','.','.'],
    ['.','.','.'],
    ['.','.','.']
]

// list of possible indexes of Titles array of divs. This will be used to check for valid moves 
var possibleIndexList = [0,1,2,3,4,5,6,7,8];

// variable for gameState (true = playable, flase = not playable)
var gameState = false;

// variable for gameType (human, random, unbeatable, unknown) changed by button click
var gameType = "unknown";

// changePlayer function is used to change the current-player variable and update the site interface accordingly
function changePlayer(){
    if(current_player === 'X'){
        current_player = 'O';
        playerDisplay.innerText = 'O';
    }else{
        current_player = 'X';
        playerDisplay.innerText = 'X';
    }
}

// this function is used to reset the board to its initial state every time we click the reset button
function getEmptyBoard(){
    board = [
        ['.','.','.'],
        ['.','.','.'],
        ['.','.','.']
    ]
}

// getWinningPlayer handles the winning conditions and returns the winning player accordingly
// there are 8 conditions: 3 rows, 3 colums, 2 diagonals checked with 2 for loops
// if no player has won, the function returns the string 'None'
function getWinningPlayer(){
    var diagonalPrincipal = '';
    var diagonalSecondary = '';
    for(var i = 0;i<board.length;i++){
        var counterX = 0;
        var counterO = 0;
        diagonalPrincipal += board[i][i];
        diagonalSecondary += board[i][board.length-1-i];
        if(board[i].join('')==='XXX'){
            return 'X';
        }else if(board[i].join('')==='OOO'){
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
            return 'X'         
        }else if(counterO === 3){
            return 'O'         
        }
    }
    if(diagonalPrincipal === 'XXX'||diagonalSecondary === 'XXX'){
        return 'X'
    }else if(diagonalPrincipal === 'OOO'||diagonalSecondary === 'OOO'){
        return 'O'
    }
    return 'None'
}


function printResult(){
    var winner = getWinningPlayer();
    switch(winner){
        case 'X':
            announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
            announcer.classList.remove('hide');
            gameState = false;
            break;
        case 'O':
            announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
            announcer.classList.remove('hide');
            gameState = false;
            break;
    }
    if(winner === 'None' && isBoardFull() === true){
        announcer.innerHTML = 'It\'s a tie!';
        announcer.classList.remove('hide');
        gameState = false;
    }
}

// isBoardFull returns a boolean value representing wether the board is full, or not (all tiles are filed with an O or an X)
function isBoardFull(){
    for(var item of board){
        for(var element of item){
            if (element === '.'){
                return false
            }
        }
    } 
    return true
}

function getPlayerMove(tile, input){
    var indexOfInput = possibleIndexList.indexOf(input);
    if(indexOfInput !== -1){
        var stIndex = Math.floor(input/3);
        var ndIndex = input%3;
        tile.innerText = current_player;
        board[stIndex][ndIndex] = current_player;
        possibleIndexList.splice(indexOfInput,1);
        changePlayer();
        if(gameType === 'random' && isBoardFull() === false){
            indexOfInput = Math.floor(Math.random()*possibleIndexList.length);
            var randIndex = possibleIndexList[indexOfInput];
            stIndex = Math.floor(randIndex/3);
            ndIndex = randIndex%3;
            tiles[randIndex].innerText = current_player;
            board[stIndex][ndIndex] = current_player;
            possibleIndexList.splice(indexOfInput,1);
            changePlayer();
        }else if(gameType === 'unbeatable' && isBoardFull() === false){

        }
    }else{
        alert('Incorrect move! Please, try again.')
    }
}

function userAction(x,y){
    if(gameState){
        getPlayerMove(x,y);
        printResult();
        console.log(board);
        console.log(isBoardFull());
        console.log(gameType);
    }  
}

// implementing the resetBoard function 
// text of tiles is reset to ''
// current_player is reset to 'X'
// board is reset
// announcer is hidden
// gameState becomes false
// option buttons are reappearing
// reset the possibleIndexList so that we can check again for valid moves
function resetBoard(){
    tiles.forEach( tile => tile.innerText = '')
    if (current_player === "O"){
            current_player = "X";
            playerDisplay.innerText = 'X';
    }
    getEmptyBoard();
    announcer.classList.add('hide');
    gameState = false;
    randomButton.removeAttribute('hidden');
    humanButton.removeAttribute('hidden');
    unbeatableButton.removeAttribute('hidden');
    resetButton.setAttribute("hidden", true);
    gameType = "unknown";
    possibleIndexList = [0,1,2,3,4,5,6,7,8];
}

// chooseRandom changes gameType and hides all buttons except Reset
function chooseRandom(){
    resetButton.removeAttribute('hidden');
    unbeatableButton.setAttribute("hidden", true);
    humanButton.setAttribute("hidden", true);
    randomButton.setAttribute("hidden", true);
    gameType = "random";
    gameState = true;
}

// chooseUnbeatable changes gameType and hides all buttons except Reset
function chooseUnbeatable(){
    resetButton.removeAttribute('hidden');
    randomButton.setAttribute("hidden", true);
    humanButton.setAttribute("hidden", true);
    unbeatableButton.setAttribute("hidden", true);
    gameType = "unbeatable";
    gameState = true;
}

// chooseHuman changes gameType and hides all buttons except Reset
function chooseHuman(){
    resetButton.removeAttribute('hidden');
    unbeatableButton.setAttribute("hidden", true);
    randomButton.setAttribute("hidden", true);
    humanButton.setAttribute("hidden", true);
    gameType = "human";
    gameState = true;
}

