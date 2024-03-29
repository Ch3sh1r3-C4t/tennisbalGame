/*jshint esversion: 6 */

    var canvas;
    var canvasContext;
    var ballX = 50;
    var ballSpeedX = 10;
    var ballY = 50;
    var ballSpeedY = 4;

    var player1Score = 0;
    var player2Score = 0;
    const WINNING_SCORE = 3;
    var showingWinScreen = false;

    var paddle1Y = 250;
    var paddle2Y = 250;
    const PADDLE_HEIGHT = 100;
    const PADDLE_THIKNESS = 10;

    function colorRect(lefX,topY,width,height,drawColour){
        //first number how far from the left, second how far from the top, third and forth dimensions for center subtract half of w and h, order important for overlapping -->
        canvasContext.fillStyle = drawColour;
        canvasContext.fillRect(lefX,topY,width,height);
    }

    function colorCircle(centerX, centerY,radious,drawColour){
        canvasContext.fillStyle = drawColour;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY,radious, 0,Math.PI*2,true);
        canvasContext.fill();
    }

function drawNet(){
        for (var i = 0; i < canvas.height; i+= 40) {
            colorRect(canvas.width/2 - 1,i,2,20,'white');
        }
    }

    function drawEverything(){
        //make black canvas
        colorRect(0,0,canvas.width,canvas.height,'black');
        if(showingWinScreen){
            canvasContext.fillStyle = "white";
            if (player1Score >= WINNING_SCORE){
                canvasContext.fillText("Player won!",350,200);
            }
            else if (player2Score >= WINNING_SCORE){
                canvasContext.fillText("Computer won!",250,500);
            }

            canvasContext.fillText("click to continue",350,500);
            return;
        }
        //paddle1
        colorRect(0,paddle1Y,PADDLE_THIKNESS,PADDLE_HEIGHT,'white');
        //paddle2
        colorRect(canvas.width - PADDLE_THIKNESS,paddle2Y,PADDLE_THIKNESS,PADDLE_HEIGHT,'white');
        //draw net
        drawNet();
        //ball
        colorCircle(ballX,ballY,10,'yellow');
        // scrore display
        canvasContext.fillText(player1Score,100,100);
        canvasContext.fillText(player2Score,canvas.width - 100,100);

}

    function ballReset(){
        if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
            showingWinScreen = true;
        }
        ballSpeedX = -ballSpeedX;
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
    }

    function computerMovement(){
        var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
        if (paddle2YCenter < ballY-35){
            paddle2Y +=6;
        }
        else if (paddle2YCenter > ballY+35){
            paddle2Y -=6;
        }
    }

    function moveEverything(){
        if(showingWinScreen){
            return;
        }
        computerMovement();

        ballX += ballSpeedX;
        ballY += ballSpeedY;
        if(ballX < 0){
            if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT){
                ballSpeedX = -ballSpeedX;

                var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.35;

            }
            else {
            player2Score += 1;
             ballReset();
            }
        }
        if(ballX > canvas.width){
            if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT){
                ballSpeedX = -ballSpeedX;

                var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.35;
            }
            else {
            player1Score +=1;
             ballReset();
            }
        }
        if(ballY < 0){
            ballSpeedY = -ballSpeedY;
        }
        if(ballY > canvas.height){
            ballSpeedY = -ballSpeedY;
        }

    }

    function calculateMousePos(evt){
        //canvas area
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;
        //where on the page from side and top is the canvas and how far we scrolled, subracting those we find X and Y coordinater for mouse in the playable area
        var mouseX = evt.clientX - rect.left - root.scrollLeft;
        var mouseY = evt.clientY - rect.top - root.scrollTop;
        //returns the coordinates
        return{
            x:mouseX,
            y:mouseY
        };
    }

    function handleMouseClick(evt){
        if(showingWinScreen){
            player1Score = 0;
            player2Score = 0;
            showingWinScreen = false;
        }
    }

   window.onload = function() {
        canvas = document.getElementById('gameCanvas');
        canvasContext = canvas.getContext('2d');

        var framesPerSecond = 30;
        setInterval(function (){
            moveEverything();
            drawEverything();
        }, 1000/framesPerSecond);
        canvas.addEventListener('mousedown', handleMouseClick);
        canvas.addEventListener('mousemove',
        function(evt) {
            var mousePos = calculateMousePos(evt);
            paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
        });
    };
