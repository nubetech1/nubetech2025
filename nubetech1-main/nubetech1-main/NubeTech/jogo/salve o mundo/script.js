const player = document.getElementById('player');
const game = document.getElementById('game');
const platforms = document.querySelectorAll('.platform');
const message = document.getElementById('message');

const GRAVITY = 0.8;
const MOVE_SPEED = 5;
const JUMP_POWER = 16;
const COLLISION_TOLERANCE = 5;

let posX = 100;
let posY = 50;
let velocityY = 0;
let grounded = false;
let facingRight = true;
const keys = {};

window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function update() {
  const playerWidth = player.offsetWidth;
  const playerHeight = player.offsetHeight;
  const gameWidth = game.clientWidth;

  // Movimento
  if (keys['arrowright'] || keys['d']) {
    posX += MOVE_SPEED;
    facingRight = true;
  }
  if (keys['arrowleft'] || keys['a']) {
    posX -= MOVE_SPEED;
    facingRight = false;
  }

  posX = Math.max(0, Math.min(gameWidth - playerWidth, posX));

  // Pulo
  if ((keys[' '] || keys['space'] || keys['w'] || keys['arrowup']) && grounded) {
    velocityY = JUMP_POWER;
    grounded = false;
  }

  if (!grounded) {
    velocityY -= GRAVITY;
    posY += velocityY;
  }

  grounded = false;

  // Colisão com plataformas
  platforms.forEach(platform => {
    const platRect = platform.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();
    const platLeft = platRect.left - gameRect.left;
    const platBottom = gameRect.bottom - platRect.bottom;
    const platWidth = platform.offsetWidth;
    const platTop = platBottom + platform.offsetHeight;

    const playerBottom = posY;
    const playerTop = posY + playerHeight;
    const playerLeft = posX;
    const playerRight = posX + playerWidth;

    const horizontallyOverlapping = playerRight > platLeft && playerLeft < platLeft + platWidth;

    if (
      velocityY <= 0 &&
      horizontallyOverlapping &&
      playerBottom >= platTop &&
      playerBottom + velocityY <= platTop + COLLISION_TOLERANCE
    ) {
      posY = platTop;
      velocityY = 0;
      grounded = true;
    }
  });

  // Colisão com chão
  const ground = platforms[0];
  const groundHeight = ground.offsetHeight;
  if (posY < groundHeight) {
    posY = groundHeight;
    velocityY = 0;
    grounded = true;
  }

  // Coleta de sementes
  const seeds = document.querySelectorAll('.seed');
  seeds.forEach(seed => {
    const seedRect = seed.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();

    const seedLeft = seedRect.left - gameRect.left;
    const seedBottom = gameRect.bottom - seedRect.bottom;
    const seedRight = seedLeft + seed.offsetWidth;
    const seedTop = seedBottom + seed.offsetHeight;

    const playerLeft = posX;
    const playerRight = posX + playerWidth;
    const playerTop = posY + playerHeight;
    const playerBottom = posY;

    const isColliding =
      playerRight > seedLeft &&
      playerLeft < seedRight &&
      playerTop > seedBottom &&
      playerBottom < seedTop;

    if (isColliding && !seed.classList.contains('collected')) {
      seed.classList.add('collected');
      setTimeout(() => seed.remove(), 300);
    }
  });

  // Verifica se todas as sementes foram coletadas
  if (document.querySelectorAll('.seed').length === 0 && !message.classList.contains('show')) {
    message.classList.add('show');
     setTimeout(() => window.location.href = 'fase2.html', 2000);
  }

  // Atualiza a posição e sprite do personagem
  player.style.left = `${posX}px`;
  player.style.bottom = `${posY}px`;
  player.style.transform = `scaleX(${facingRight ? 1 : -1})`;

  if (keys['arrowright'] || keys['d'] || keys['arrowleft'] || keys['a']) {
  player.style.backgroundImage = "url('Prota Andando Final.gif')";
} else {
  player.style.backgroundImage = "url('Prota Respirando.gif')";
}


  requestAnimationFrame(update);
}
console.log(`Player Position: X = ${posX}, Y = ${posY}`);

update();
