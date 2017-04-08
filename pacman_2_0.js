/*      CONSTANTS       */
const MAX_X = 30;
const MAX_Y = 30;
const MAX_GHOSTS = 5;
const PLAYER_BUFFER = 1;

const PACMAN = "p";
const ENEMY = "g";
const BLOCK = "b";
const BLOCK_PCT = 0.25;
const EMPTY = "0";
const COIN = "1";
const CHERRY = "5";
const CHERRY_PCT = 0.05;

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;


/*      GLOBALS         */
var world = [];
var turns = 0;
var gameOver = false;
var rotation = 0;
var score = 0;
var player = {x:1,y:1};

/*      FUNCTIONS       */
function init() {
  // randomize player position
  player.x = Math.random()*(MAX_X-2)+1;
  player.y = Math.random()*(MAX_Y-2)+1;

  // initialize world array
  world = [];
  for(var i = 0; i < MAX_Y; i++) {
    for(var j = 0; j < MAX_X; j++) {
      // enforce borders
      if(i == 0 || i == MAX_Y-1 || j == 0 || j == MAX-1) {
        world[i][j] = BLOCK;
      }
      // prevent brick-locked player
      else if (Math.abs(i-player.y) <= PLAYER_BUFFER && Math.abs(j-player.x) <= PLAYER_BUFFER) {
        world[i][j] = randomTile(false);
      }
      else {
        world[i][j] = randomTile(true);
      }
    }
  }

  // initialize enemies
  ghosts = [];
  for (var g = 0; g < MAX_GHOSTS; g++) {
    var gx, gy;
    do {
      gx = Math.random()*(MAX_X-2)+1;
      gy = Math.random()*(MAX_Y-2)+1;
    } while(Math.abs(gx-player.x) <= PLAYER_BUFFER && Math.abs(gy-player.y) <= PLAYER_BUFFER);
    ghosts.push({x:gx, y:gy});
  }

  // unblock unit positions & add unit layer
  world[player.y][player.x] = EMPTY+PACMAN;
  for (var gh in ghosts) {
    world[ghosts[gh].y][ghosts[gh].x] = randomTile(false)+ENEMY;
  }
}

function randomTile(allowBricks) {
  var rand = Math.random();
  if(allowBricks == undefined) {
    allowBricks = true;
  }
  if(rand < CHERRY_PCT) {
    return CHERRY;
  }
  else if (allowBricks && rand < CHERRY_PCT+BLOCK_PCT) {
    return BLOCK;
  }
  else {
    return COIN;
  }
}

function validInput(e) {
  if(e.keyCode >= 37 && e.keyCode <= 40) {
    return true;
  }
  else {
    return false;
  }
}

function playerUpdate(e) {
  var destx = player.x;
  var desty = player.y;
  if(e.keyCode == LEFT) {
    destx--;
  }
  else if(e.keyCode == UP) {
    desty--;
  }
  else if(e.keyCode == RIGHT) {
    destx++;
  }
  else if(e.keyCode == DOWN) {
    desty++;
  }
}

function enemyUpdate() {

}

init();
$(document).ready(function() {
  $(document).onkeydown(function(e) {
    if(validInput(e)) {
      playerUpdate(e);
      enemyUpdate();
      checkCollision();
      displayWorld();
    }
  });
});
