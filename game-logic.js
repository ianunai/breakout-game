// grabbing a reference to the canvas element
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// defining the initial position of the center of the ball
var x = canvas.width/2;
var y = canvas.height-30;

var ballRadius = 10;// stores the radius of the ball
var ballColor = "#0095DD";

// defining the infinitesimally small change in the position of the ball
var dx = 2;
var dy = -2;

// defining a paddle to hit the ball
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var paddleColor = "#0095DD";

// keeping a status of which arrow button is pressed
var rightPressed = false;
var leftPressed = false;

// information about brick field
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

// creating a brick field
var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1};
    }
}

// method for drawing the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

// method for drawing paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}

// method for drawing the brick field
function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {// drawing the brick only if it has not been hit
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// method for drawing on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height-ballRadius){// when ball hits the bottom side
    	if(x > paddleX && x < paddleX + paddleWidth) {// paddle present to deflect the ball
    	        dy = -dy;
    	    }
    	    else {
    	        // alert("GAME OVER");
    	        // document.location.reload();
    	    }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    x += dx;
    y += dy;
}

// setting up event listeners for key presses
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// methods handling key presses
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

//method for detecting collision
function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                }
            }
        }
    }
}

// repeated call of draw() method to redraw the canvas
setInterval(draw, 10);