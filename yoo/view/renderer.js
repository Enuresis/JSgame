import { paddle } from "../controller/gameloop.js";
import { ball } from "../controller/gameloop.js";
import { paused } from "../controller/gameloop.js";
import { buffer } from "../controller/gameloop.js";

export let canvas = document.querySelector('canvas')
export let ctx = canvas.getContext("2d")


//clear the canvas
function clearCanvas() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

function renderEnemy() {
    console.log(buffer);
    for(let i = 0;i< buffer.length;i++) {
        if (buffer[i].name === 'fat') {
            ctx.fillStyle = 'yellow';
        } else {
            ctx.fillStyle = 'red';
        }
        
        ctx.fillRect(buffer[i].position.x, buffer[i].position.y, buffer[i].size.width, buffer[i].size.height);
    }
}

// render paddle
function renderPaddle(paddle) {
    ctx.fillStyle = 'red';
    ctx.fillRect(paddle.position.x, paddle.position.y, paddle.width, paddle.height);
}
// render ball
function renderBall(ball) {
    ctx.beginPath()
        ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, Math.PI*2)
        ctx.fillStyle = "#0095DD"
        ctx.fill()
        ctx.closePath()
}
// render pause
function updateOverlay() {
    if (paused) {
      document.getElementById("overlay").style.display = "block";
    } else {
      document.getElementById("overlay").style.display = "none";
    }
}

// render on screen
export function renderGame() {
    updateOverlay();
    clearCanvas();
    renderPaddle(paddle);
    renderBall(ball);
    renderEnemy();
}
