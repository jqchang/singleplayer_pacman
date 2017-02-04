var world = [];
var turns = 0;
var gameOver = false;
var rotation = 0;
var MAX_X = 30;
var MAX_Y = 30;
var TURNS_PER_GHOST_MOVE = 2;
for(var i = 0; i<MAX_Y; i++) {
  world.push([]);
}


// const defaultworld = [
//   [2,2,2,2,2,2,2,2,2,2,2],
//   [2,'p',1,1,1,1,1,1,1,1,2],
//   [2,1,1,1,1,1,1,1,1,1,2],
//   [2,1,1,1,1,1,1,1,1,1,2],
//   [2,1,1,1,1,1,1,1,1,1,2],
//   [2,1,1,1,1,1,1,1,1,1,2],
//   [2,1,1,1,1,1,1,1,1,1,2],
//   [2,2,2,2,2,2,2,2,2,2,2]
// ];

var pacman = {
  x: 1,
  y: 1
};

var ghosts = [];

console.log(ghosts);
var score = 0;

function spawnGhosts() {
  ghosts = [];
  for (var g = 0; g < 5; g++) {
    ghosts.push( {
      x: Math.floor(Math.random()*(MAX_X-2))+1,
      y: Math.floor(Math.random()*(MAX_Y-2))+1,
      moved: false
    })
  }
}

function shuffle() {
  gameOver = false;
  $("#score p").text("");
  score=0;
  for(var i = 0; i<MAX_Y; i++) {
    for(var j = 0; j < MAX_X; j++) {
      if(i == 0 || i == MAX_Y-1 || j == 0 || j == MAX_X-1) {
        world[i][j] = 2;
      }
      else if (Math.abs(i-pacman.y) <= 1 && Math.abs(j-pacman.x) <= 1) {
        world[i][j] = 1;
      }
      else {
        if(Math.random() < 0.25) {
          world[i][j] = 2;
        }
        else {
          world[i][j] = 1;
        }
      }
    }
  }
  spawnGhosts();
  for(var gh in ghosts) {
    world[ghosts[gh].y][ghosts[gh].x] = 'G';
  }
  world[pacman.y][pacman.x] = 'p';
}

function ghostMove() {
  // iterate through ghost list
    // check x and y direction, collision
  var deferredqueue = [];

  for(var gh in ghosts) {
    var yPriority = (Math.abs(ghosts[gh].y-pacman.y) >= Math.abs(ghosts[gh].x-pacman.x));
    var movequeue = [];
    if(yPriority) {
      if(ghosts[gh].y > pacman.y) {
        movequeue.push(function() { return move("up", ghosts[gh]) });
      }
      else {
        movequeue.push(function() { return move("down", ghosts[gh]) });
      }
      if(ghosts[gh].x > pacman.x) {
        movequeue.push(function() { return move("left", ghosts[gh]) });
      }
      else {
        movequeue.push(function() { return move("right", ghosts[gh]) });
      }
    }
    else {
      if(ghosts[gh].x > pacman.x) {
        movequeue.push(function() { return move("left", ghosts[gh]) });
      }
      else {
        movequeue.push(function() { return move("right", ghosts[gh]) });
      }
      if(ghosts[gh].y > pacman.y) {
        movequeue.push(function() { return move("up", ghosts[gh]) });
      }
      else {
        movequeue.push(function() { return move("down", ghosts[gh]) });
      }
    }
    var i = 0;
    var moved = false;
    var thisghostdefer = [];
    while(i < movequeue.length && !moved) {
      moved = movequeue[i]();
      if(!moved) {
        thisghostdefer.push(movequeue[i]);
        // console.log(movequeue[i],"deferred",gh);
      }
      i++;
    }
    if(moved) {
      console.log("purging queue",thisghostdefer);
      thisghostdefer = [];
    }
    else {
      for(var dq in thisghostdefer) {
        deferredqueue.push(thisghostdefer[dq]);
      }
    }
    if(ghosts[gh].x == pacman.x && ghosts[gh].y == pacman.y) {
      console.log("Game Over!");
      gameOver = true;
    }
  }
  console.log("backlog",deferredqueue.length);
  for(var j = 0; j < deferredqueue.length; j++) {
    if(deferredqueue[j]()) {
      break;
    }
  }
  deferredqueue = [];
}

function move(direction, ghost) {
  var destx = ghost.x;
  var desty = ghost.y;
  var onCoin = Boolean(world[ghost.y][ghost.x] == 'G');
  if(direction == "left") {
    destx--;
  }
  else if (direction == "up") {
    desty--;
  }
  else if (direction == "right") {
    destx++;
  }
  else if (direction == "down") {
    desty++;
  }

  if(world[desty][destx] == 2 || world[desty][destx] == 'G' || world[desty][destx] == 'g') {
    return false;
  }

  else {
    //replace destination with ghost
    if(world[desty][destx] == 1) {
      world[desty][destx] = 'G';
    }
    else if(world[desty][destx] == 0){
      world[desty][destx] = 'g';
    }

    if(onCoin) {
      world[ghost.y][ghost.x] = 1;
    }
    else {
      world[ghost.y][ghost.x] = 0;
    }
    ghost.x = destx;
    ghost.y = desty;
    ghost.moved = true;
    return true;
  }
}

function playerMove(e) {
  var rotation = 0;
  if(e.keyCode == 37) {
    //LEFT
    rotation = 180;
    if(world[pacman.y][pacman.x-1] != 2) {
      if(world[pacman.y][pacman.x-1] == 1) {
        score += 10;
      }
      world[pacman.y][pacman.x] = 0;
      world[pacman.y][pacman.x-1] = 'p';
      pacman.x--;
    }
    else {
      console.log("blocked at left!");
    }
  }
  else if (e.keyCode == 38) {
    //UP
    rotation = 270;
    if(world[pacman.y-1][pacman.x] != 2) {
      if(world[pacman.y-1][pacman.x] == 1) {
        score += 10;
      }
      world[pacman.y][pacman.x] = 0;
      world[pacman.y-1][pacman.x] = 'p';
      pacman.y--;
    }
    else {
      console.log("blocked at up!");
    }
  }
  else if (e.keyCode == 39) {
    //RIGHT
    rotation = 0;
    if(world[pacman.y][pacman.x+1] != 2) {
      if(world[pacman.y][pacman.x-1] == 1) {
        score += 10;
      }
      world[pacman.y][pacman.x] = 0;
      world[pacman.y][pacman.x+1] = 'p';
      pacman.x++;
    }
    else {
      console.log("blocked at left!");
    }
  }
  else if (e.keyCode == 40) {
    //DOWN
    rotation = 90;
    if(world[pacman.y+1][pacman.x] != 2) {
      if(world[pacman.y+1][pacman.x] == 1) {
        score += 10;
      }
      world[pacman.y][pacman.x] = 0;
      world[pacman.y+1][pacman.x] = 'p';
      pacman.y++;
    }
    else {
      console.log("blocked at down!");
    }
  }
  return rotation;
}

function displayWorld() {
  var worldstring = "";
  for(var i = 0; i < world.length; i++) {
    worldstring += "<div class='row'>";
    for(var j = 0; j < world[i].length; j++) {
      if(world[i][j] == 'p') {
        worldstring += "<img src='pacman.png' class='pacman', id='pacman'>";
      }
      else if(world[i][j] == 'g' || world[i][j] == 'G') {
        worldstring += "<div class='ghost'></div>";
      }
      else if(world[i][j] == 1) {
        worldstring += "<div class='coin'></div>";
      }
      else if (world[i][j] == 2) {
        worldstring += "<div class='brick'></div>";
      }
      else if (world[i][j] == 0){
        worldstring += "<div class='empty'></div>";
      }
      else {
        /*        DEBUG       */
        worldstring += "<div class='error'></div>";
      }
    }
    worldstring += "</div>";
  }
  $("#world").html(worldstring);
}

shuffle();

$(document).ready(function() {
  console.log("Hello World!");
  shuffle();
  displayWorld();
});

$(document).on("keydown", function(e) {
  var rotate = 0;
  turns++;
  if (e.keyCode == 82){
    shuffle();
  }
  else if(!gameOver) {
    // console.log(e.keyCode);
    rotate = playerMove(e);
    if(turns%TURNS_PER_GHOST_MOVE == 0) {
      ghostMove();
    }
  }
  else {
    console.log("game ended already");
    return false;
  }
  displayWorld();
  $("#pacman").css("transform",`rotate(${rotate}deg)`);
  $("#score h1").text("Score: "+score);
  if(gameOver) {
    $("#score p").text("Game Over!");
  }
});
