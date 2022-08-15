/// DO NOT MODIFY THIS
const tiles = Array.from(document.querySelectorAll('.tile'));
const playerDisplay = document.querySelector('.display-player');
const resetButton = document.querySelector('#reset');
const announcer = document.querySelector('.announcer');
const randomAIButton = document.querySelector('#random');
const unbeatableAIButton = document.querySelector('#unbeatable');
const humanButton = document.querySelector('#human');
const smartAIButton = document.querySelector('#smart');
const AIvsAIbutton = document.querySelector('#AIvsAI')

tiles.forEach( (tile, index) => {
    tile.addEventListener('click', () => userAction(tile, index));
});

resetButton.addEventListener('click', resetBoard);
randomAIButton.addEventListener('click', chooseRandomAI);
unbeatableAIButton.addEventListener('click', chooseUnbeatableAI);
humanButton.addEventListener('click', chooseHuman);
smartAIButton.addEventListener('click',chooseSmartAI);
AIvsAIbutton.addEventListener('click', chooseAIvsAI);

/// START CODE AFTER THIS

// importing the functions from minimax.js file as it was bothersome to write it here and test it in the same time
// const minimax = require("./minimax");

// current player keeps track of current turn player(either X, or O)
var current_player = 'X';

// board is used to work here internally on js and it is different than the tiles array
var board = [
    ['.','.','.'],
    ['.','.','.'],
    ['.','.','.']
]

//
var delayedRun;

// list of possible indexes of Titles array of divs. This will be used to check for valid moves 
var possibleIndexList = [0,1,2,3,4,5,6,7,8];

// variable for gameState (true = playable, flase = not playable)
var gameState = false;

// variable for gameType (human, random, unbeatable, unknown, smart) changed by button click
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

// printResul handles the printing/annoncing part of the game
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

function AIGoesForEasyWin(){
    for (let i =0; i < 3; i++){
        for (let j = 0; j < 3; j++){
            var indexOfTile = i*3+j;
            if(possibleIndexList.indexOf(indexOfTile)!==-1){
                board[i][j] = current_player;
                if(getWinningPlayer() === current_player){ 
                    board[i][j] = current_player;
                    tiles[indexOfTile].innerText = current_player;
                    tiles[indexOfTile].classList.add(`Player${current_player}`);
                    possibleIndexList.splice(possibleIndexList.indexOf(indexOfTile), 1);
                    return;
                }else{
                    board[i][j] = ".";
                }
            }
        }
    }
}

function AIPreventsEasyLose(){
    for (let i =0; i < 3; i++){
        for (let j = 0; j < 3; j++){
            var indexOfTile = i*3+j;
            if(possibleIndexList.indexOf(indexOfTile)!==-1){
                board[i][j] = "X"
                if(getWinningPlayer() === "X"){ 
                    board[i][j] = current_player;
                    tiles[indexOfTile].innerText = current_player;
                    tiles[indexOfTile].classList.add(`Player${current_player}`);
                    possibleIndexList.splice(possibleIndexList.indexOf(indexOfTile), 1);
                    return;
                }else{
                    board[i][j] = ".";
                }
            }
        }
    }
}

// random move for the AI
function getRandomAIMove(){
    indexOfInput = Math.floor(Math.random()*possibleIndexList.length);
    var randIndex = possibleIndexList[indexOfInput];
    stIndex = Math.floor(randIndex/3);
    ndIndex = randIndex%3;
    tiles[randIndex].classList.add(`Player${current_player}`);
    tiles[randIndex].innerText = current_player;
    board[stIndex][ndIndex] = current_player;
    possibleIndexList.splice(indexOfInput,1);
    changePlayer();
}

// bestMove function decides which move is the best according to the minimax algorithm
// it will return the correct indeces (row, col) for the board position
function bestMove(){
    var bestScore = -999;
    var move = [];
    var score;
    for(var i=0;i<board.length;i++){
        for(var j=0;j<board.length;j++){
            if(board[i][j] === '.'){
                board[i][j] = current_player;
                score = minimax(board,0,false,current_player);
                board[i][j] = '.';
                if(score > bestScore){
                    bestScore = score;
                    move[0] = i;
                    move[1] = j;
                }
            }
        }
    }
    board[move[0]][move[1]] = current_player;
    tiles[move[0]*3+move[1]].classList.add(`Player${current_player}`);
    tiles[move[0]*3+move[1]].innerText = current_player;
    possibleIndexList.splice(possibleIndexList.indexOf(move[0]*3+move[1]),1);
    changePlayer();
    return
}

// minimax function used to calculate the scores for bestMoves 
// board is the current state of the game
// depth is the current depth of the search
// isMaximizing is establishing wether the function plays as the maximizer or the minimizer
function minimax(board,depth,isMaximizing,player){
    var winner = getWinningPlayer();
    if(winner === 'X'){
        return -100 + depth
    }else if(winner === 'O'){
        return 100 - depth
    }else if(winner === 'None' && isBoardFull() === true){
        return 0
    }
    
    if (player==='X')
        player='O';
    else
        player='X';

    if(isMaximizing){
        var bestScore = -999;
        for(var i=0;i<board.length;i++){
            for(var j=0;j<board.length;j++){
                if(board[i][j]==='.'){
                    board[i][j] = player; 
                    var score = minimax(board,depth+1,false,player);
                    board[i][j] = '.';
                    if(score>bestScore){
                        bestScore = score;
                    }
                }
            }
        }
        return bestScore
    }else{
        var bestScore = 999;
        for(var i=0;i<board.length;i++){
            for(var j=0;j<board.length;j++){
                if(board[i][j]==='.'){
                    board[i][j] = player; 
                    var score = minimax(board,depth+1,true,player);
                    board[i][j] = '.';
                    if(score<bestScore){
                        bestScore = score;
                    }
                }
            }
        }
        return bestScore
    }
}


function getPlayerMove(tile, input){
    var indexOfInput = possibleIndexList.indexOf(input);
    if(indexOfInput !== -1){
        var stIndex = Math.floor(input/3);
        var ndIndex = input%3;
        tile.classList.add(`Player${current_player}`)
        tile.innerText = current_player;
        board[stIndex][ndIndex] = current_player;
        possibleIndexList.splice(indexOfInput,1);
        changePlayer();
        printResult();
        if(gameType === 'random' && isBoardFull() === false && getWinningPlayer() === 'None'){
            gameState = false;
            // resetButton.setAttribute("hidden", true);
            delayedRun = setTimeout(function(){
                getRandomAIMove();
                gameState = true;
                printResult();
                // resetButton.removeAttribute('hidden');
            },1500);
        }else if(gameType === 'unbeatable' && isBoardFull() === false && getWinningPlayer() === 'None'){
            gameState = false;
            // resetButton.setAttribute("hidden", true);
            delayedRun = setTimeout(function(){
                bestMove();
                gameState = true;
                printResult();
                // resetButton.removeAttribute('hidden');
            },1500);
        }else if(gameType === 'smart' && isBoardFull() === false && getWinningPlayer() === 'None'){
            gameState = false;
            // resetButton.setAttribute("hidden", true);
            delayedRun = setTimeout(function(){
                var freeSpace = possibleIndexList.length;
                AIGoesForEasyWin();
                if(possibleIndexList.length === freeSpace){ 
                    AIPreventsEasyLose();
                    if((possibleIndexList.length === freeSpace)){
                        getRandomAIMove();
                    }else{
                        changePlayer();
                    }
                }else{
                    changePlayer();
                }
                gameState = true;
                printResult();
                // resetButton.removeAttribute('hidden');
            },1500);
        }
    }else{
        alert('Incorrect move! Please, try again.')
    }
}

function userAction(tile,index){
    if(gameState){
        getPlayerMove(tile,index);
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
    clearTimeout(delayedRun);
    tiles.forEach( tile => tile.innerText = '')
    if (current_player === "O"){
            current_player = "X";
            playerDisplay.innerText = 'X';
    }
    getEmptyBoard();
    announcer.classList.add('hide');
    gameState = false;
    randomAIButton.removeAttribute('hidden');
    humanButton.removeAttribute('hidden');
    unbeatableAIButton.removeAttribute('hidden');
    smartAIButton.removeAttribute('hidden');
    AIvsAIbutton.removeAttribute('hidden');
    resetButton.setAttribute("hidden", true);
    gameType = "unknown";
    possibleIndexList = [0,1,2,3,4,5,6,7,8];
    for(item of tiles){
        item.classList.remove('PlayerX');
        item.classList.remove('PlayerO');
    }
}

// chooseRandom changes gameType and hides all buttons except Reset
function chooseRandomAI(){
    resetButton.removeAttribute('hidden');
    unbeatableAIButton.setAttribute("hidden", true);
    humanButton.setAttribute("hidden", true);
    randomAIButton.setAttribute("hidden", true);
    smartAIButton.setAttribute("hidden", true);
    AIvsAIbutton.setAttribute('hidden',true);
    gameType = "random";
    gameState = true;
}

// chooseUnbeatable changes gameType and hides all buttons except Reset
function chooseUnbeatableAI(){
    resetButton.removeAttribute('hidden');
    randomAIButton.setAttribute("hidden", true);
    humanButton.setAttribute("hidden", true);
    unbeatableAIButton.setAttribute("hidden", true);
    smartAIButton.setAttribute("hidden", true);
    AIvsAIbutton.setAttribute('hidden',true);
    gameType = "unbeatable";
    gameState = true;
}

// chooseHuman changes gameType and hides all buttons except Reset
function chooseHuman(){
    resetButton.removeAttribute('hidden');
    unbeatableAIButton.setAttribute("hidden", true);
    randomAIButton.setAttribute("hidden", true);
    humanButton.setAttribute("hidden", true);
    smartAIButton.setAttribute("hidden", true);
    AIvsAIbutton.setAttribute('hidden',true);
    gameType = "human";
    gameState = true;
}

// chooseSmart changes gameType for smart randomAI and hides buttons except reset
function chooseSmartAI(){
    resetButton.removeAttribute('hidden');
    unbeatableAIButton.setAttribute("hidden", true);
    randomAIButton.setAttribute("hidden", true);
    humanButton.setAttribute("hidden", true);
    smartAIButton.setAttribute("hidden", true);
    AIvsAIbutton.setAttribute('hidden',true);
    gameType = "smart";
    gameState = true;
}

//
function chooseAIvsAI(){
    resetButton.removeAttribute('hidden');
    unbeatableAIButton.setAttribute("hidden", true);
    randomAIButton.setAttribute("hidden", true);
    humanButton.setAttribute("hidden", true);
    smartAIButton.setAttribute("hidden", true);
    AIvsAIbutton.setAttribute('hidden',true);
    gameType = "AIvsAI";
    gameState = true;
    while(gameType="AIvsAI" && isBoardFull() === false && getWinningPlayer() === 'None'){
        getRandomAIMove();
    }
    printResult();
}

// delayedRun = setTimeout(function(){
//     getRandomAIMove();
//     gameState = true;
//     printResult();
//     // resetButton.removeAttribute('hidden');
// },1500);
// }