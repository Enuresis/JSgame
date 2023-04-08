import { paddle } from "../controller/gameloop.js";
import { ball } from "../controller/gameloop.js";
import { states } from "../controller/gameloop.js";
import { buffer } from "../controller/gameloop.js";
import { mainBuffer } from "../controller/gameloop.js";
import { optionBuffer } from "../controller/gameloop.js";

export let canvas = document.querySelector('canvas')
export let ctx = canvas.getContext("2d")


//clear the canvas
function clearCanvas() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

function renderEnemy() {
    //console.log(buffer);
    for(let i = 0;i< buffer.length;i++) {
        if (buffer[i].name === 'crazy') {
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
export function updateOverlay() {
    if (states.paused) {
      document.getElementById("overlay").style.display = "block";
    } else {
      document.getElementById("overlay").style.display = "none";
    }
}

function renderButton(buffer) {
    buffer.forEach((Button) => {
        ctx.fillStyle = 'red';
        ctx.fillRect(Button.position.x, Button.position.y, Button.dimentions.width, Button.dimentions.height);
        //console.log(Button);
        ctx.fillStyle = 'white';
        ctx.font = "48px serif";
        ctx.fillText(Button.name, Button.position.x+Button.dimentions.width/2, Button.position.y+Button.dimentions.height/2);
    });
    //console.log(mainBuffer);
}

// render on screen
export function renderGame() {
    clearCanvas();
    renderPaddle(paddle);
    renderBall(ball);
    renderEnemy();
}

export function renderOptions() {
    clearCanvas();
    renderButton(optionBuffer);
}

export function renderMainMenu() {
    clearCanvas();
    renderButton(mainBuffer);
}