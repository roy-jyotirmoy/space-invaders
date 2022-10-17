const grid = document.querySelectorAll('.grid');
const resultDisplay = document.querySelector('.result');
const width = 15,
  height = 15; //denotes number of squares in row & column of the grid
let currentShooterIndex = 202;
let direction = 1; //direction the invaders will move
let result = 0;
let invadersId;
let goingRight = true;
let aliensRemoved = [];

for (let i = 0; i < 225; i++) {
  const square = document.createElement('div');
  grid[0].appendChild(square);
}

const squares = Array.from(document.querySelectorAll('.grid div'));

const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39,
];

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add('invader');
    }
  }
}
draw();

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader');
  }
}

squares[currentShooterIndex].classList.add('shooter');

function moveShooter(e) {
  squares[currentShooterIndex].classList.remove('shooter');
  switch (e.key) {
    case 'ArrowLeft':
      if (currentShooterIndex % width !== 0) currentShooterIndex -= 1; //within the left edge of the grid
      break;
    case 'ArrowRight':
      if (currentShooterIndex % width < width - 1) currentShooterIndex += 1; //within the right edge of the grid
      break;
  }
  squares[currentShooterIndex].classList.add('shooter');
}
document.addEventListener('keydown', moveShooter);

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge =
    alienInvaders[alienInvaders.length - 1] % width === width - 1;
  remove();

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1; //will move invaders down when they hit the right edge
      direction = -1;
      goingRight = false;
    }
  }

  if (leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1; //will move invaders down when they hit the left edge
      direction = 1;
      goingRight = true;
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }
  draw();

  if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
    resultDisplay.textContent = 'Game Over!';
    clearInterval(invadersId);
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > squares.length) {
      resultDisplay.textContent = 'Game Over!';
      clearInterval(invadersId);
    }
  }

  if (aliensRemoved.length === alienInvaders.length) {
    //check for win
    resultDisplay.textContent = 'You Win! Score: ' + result;
    clearInterval(invadersId);
  }
}
invadersId = setInterval(moveInvaders, 500);

function shoot(e) {
  let laserId;
  let currentLaserIndex = currentShooterIndex;
  function moveLaser() {
    squares[currentLaserIndex].classList.remove('laser');
    currentLaserIndex -= width;
    squares[currentLaserIndex].classList.add('laser');

    if (squares[currentLaserIndex].classList.contains('invader')) {
      squares[currentLaserIndex].classList.remove('laser');
      squares[currentLaserIndex].classList.remove('invader');
      squares[currentLaserIndex].classList.add('boom');

      setTimeout(
        () => squares[currentLaserIndex].classList.remove('boom'),
        300
      );
      clearInterval(laserId);

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
      aliensRemoved.push(alienRemoved);
      result++;
      resultDisplay.textContent = 'Score: ' + result;
    }
  }
  switch (e.key) {
    case 's':
      laserId = setInterval(moveLaser, 100); //press 's' to shoot laser
  }
}
document.addEventListener('keydown', shoot);
