var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };

var canvas = document.createElement('canvas');
var width = 400;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
};

var step = function() {
  update();
  render();
  animate(step);
};

var update = function() {
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
};

var render = function() {
  context.fillStyle = "#FFF";
  context.fillRect(0, 0, width, height);
  // Red line
  context.fillStyle = "#FF0000";
  context.fillRect(0, 295, width, 10);
  // Blue line top
  context.fillStyle = "blue";
  context.fillRect(0, 220, width, 10);  
  // Blue line bottom
  context.fillStyle = "blue";
  context.fillRect(0, 370, width, 10);  
  // Goal line top
  context.fillStyle = "#FF0000";
  context.fillRect(0, 7, width, 2);
  // Goal line bottom
  context.fillStyle = "#FF0000";
  context.fillRect(0, 591, width, 2);
  // Faceoff circle top left
  context.beginPath();
  context.arc(90,110,60,0,2*Math.PI);
  context.stroke();
  context.lineWidth = 5;
  context.strokeStyle = "#FF0000";
  // Faceoff circle top right
  context.beginPath();
  context.arc(310,110,60,0,2*Math.PI);
  context.stroke();
  context.lineWidth = 5;
  context.strokeStyle = "#FF0000";
  // Faceoff circle maint
  context.beginPath();
  context.arc(200,300,60,0,2*Math.PI);
  context.stroke();
  context.lineWidth = 5;
  context.strokeStyle = "#FF0000";
  // Faceoff circle top left
  context.beginPath();
  context.arc(90,490,60,0,2*Math.PI);
  context.stroke();
  context.lineWidth = 5;
  context.strokeStyle = "#FF0000";
  // Faceoff circle top right
  context.beginPath();
  context.arc(310,490,60,0,2*Math.PI);
  context.stroke();
  context.lineWidth = 5;
  context.strokeStyle = "#FF0000";

  player.render();
  computer.render();
  ball.render();
};

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Paddle.prototype.render = function() {
  context.fillStyle = "#0000FF";
  context.fillRect(this.x, this.y, this.width, this.height);
};

function Player() {
   this.paddle = new Paddle(175, 580, 50, 10);
}

function Computer() {
  this.paddle = new Paddle(175, 10, 50, 10);
}  

Player.prototype.render = function() {
  this.paddle.render();
};

Computer.prototype.render = function() {
  this.paddle.render();
};

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 0;
  this.y_speed = 3;
  this.radius = 5;
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#000000";
  context.fill();
};

var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);

Ball.prototype.update = function(paddle1, paddle2) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  var top_x = this.x - 5;
  var top_y = this.y - 5;
  var bottom_x = this.x + 5;
  var bottom_y = this.y + 5;

  if(this.x - 5 < 0) { // hitting the left wall
    this.x = 5;
    this.x_speed = -this.x_speed;
  } else if(this.x + 5 > 400) { // hitting the right wall
    this.x = 395;
    this.x_speed = -this.x_speed;
  }

  if(this.y < 0 || this.y > 600) { // a point was scored
  if(this.y < 0) {
    updateScore("player");
  } else {
    updateScore("computer");
  }

    this.x_speed = 0;
    this.y_speed = 3;
    this.x = 200;
    this.y = 300;
  }

  if(this.y < 0) {
    playerScore += 1;
  }

  if(top_y > 300) {
    if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
      // hit the player's paddle
      this.y_speed = -3;
      this.x_speed += (paddle1.x_speed / 2);
      this.y += this.y_speed;
    }
  } else {
    if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
      // hit the computer's paddle
      this.y_speed = 3;
      this.x_speed += (paddle2.x_speed / 2);
      this.y += this.y_speed;
    }
  }
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 37) { // left arrow
      this.paddle.move(-4, 0);
    } else if (value == 39) { // right arrow
      this.paddle.move(4, 0);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.x < 0) { // all the way to the left
    this.x = 0;
    this.x_speed = 0;
  } else if (this.x + this.width > 400) { // all the way to the right
    this.x = 400 - this.width;
    this.x_speed = 0;
  }
};

Computer.prototype.update = function(ball) {
  var x_pos = ball.x;
  var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
  if(diff < 0 && diff < -4) { // max speed left
    diff = -5;
  } else if(diff > 0 && diff > 4) { // max speed right
    diff = 5;
  }
  this.paddle.move(diff, 0);
  if(this.paddle.x < 0) {
    this.paddle.x = 0;
  } else if (this.paddle.x + this.paddle.width > 400) {
    this.paddle.x = 400 - this.paddle.width;
  }
};

function updateScore(player) {
  var updateScore = document.getElementById(player);
  if (player === "player") {
    playerScore += 1;
    updateScore.innerHTML = "You: " + playerScore;
  } else {
    computerScore += 1;
    updateScore.innerHTML = "Comp: " + computerScore;
  }
}

var playerScore = 0,
  computerScore = 0;