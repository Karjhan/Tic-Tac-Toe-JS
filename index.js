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






