import { paddle } from "../controller/gameloop.js";
import { ball } from "../controller/gameloop.js";

export let canvas = document.querySelector('canvas')
export let ctx = canvas.getContext("2d")


//clear the canvas
function clearCanvas() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

// render paddle
function renderPaddle(paddle) {
    ctx.fillStyle = 'red';
    ctx.fillRect(paddle.position.x, paddle.position.y, paddle.width, paddle.height);
}

function renderBall(ball) {
    ctx.beginPath()
        ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, Math.PI*2)
        ctx.fillStyle = "#0095DD"
        ctx.fill()
        ctx.closePath()
}

// render on screen
export function renderGame() {
    clearCanvas();
    renderPaddle(paddle);
    renderBall(ball);
}
