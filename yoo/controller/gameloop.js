import {renderGame} from "../view/renderer.js";
import {Paddle} from "../model/paddle.js";
import {canvas} from "../view/renderer.js";
import {Ball} from "../model/ball.js";
import {Vector} from "../model/vector.js";
import { Enemy } from "../model/enemy.js";

let rightPressed = false;
let leftPressed = false;
let enemyNumber = 0;
let frames = 0;
export let buffer = [];
export let paused = false;

// create paddle object and ball object
export const paddle = new Paddle(100,10);
export const ball = new Ball(10,20);

function spawner() {
    if(frames % 500 === 0) {
        buffer.push(new Enemy({position: {x: 10,y: 20},size:{width: 50,height:50}},10,2));
        frames = 0;
    }
}


// escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      paused = !paused;
      updateOverlay();
    }
});
// handle states
function statemachine() {
    if (paused) {
      return 'paused';
    } else {
      return 'running';
    }
}

function collision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// handle movement for objects
function movement() {
    function movePaddle() {
        if (leftPressed && paddle.position.x > 0) {
            paddle.moveLeft();
        }
        if (rightPressed && paddle.position.x + paddle.width < canvas.width) {
            
            paddle.moveRight();
        }
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                leftPressed = true;
            } else if (event.key === 'ArrowRight') {
                rightPressed = true;
            }
        });
        document.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowLeft') {
                leftPressed = false
            } else if (event.key === 'ArrowRight') {
                rightPressed = false
            }
        });
    }
    function moveBall() {
        let velocity = new Vector(ball.velocity.x, ball.velocity.y);
        let position = new Vector(ball.position.x, ball.position.y);

        position = position.add(velocity);

        if (position.x - ball.radius < 0 || position.x + ball.radius > canvas.width) {
            velocity = velocity.reflect(new Vector(-1, 0));
        }
        if (position.y - ball.radius< 0 || position.y + ball.radius > canvas.height) {
            velocity = velocity.reflect(new Vector(0, -1));
        }

        const ballBox = {
            x: position.x - ball.radius,
            y: position.y - ball.radius,
            width: ball.radius * 2,
            height: ball.radius * 2
        };
        const paddleBox = {
            x: paddle.position.x,
            y: paddle.position.y,
            width: paddle.width,
            height: paddle.height
        };

        if (collision(ballBox, paddleBox)) {
            velocity = velocity.reflect(new Vector(0, 1));
        }

        ball.position.x = position.x;
        ball.position.y = position.y;
        ball.velocity.x = velocity.x;
        ball.velocity.y = velocity.y;
    }

    // call individual moves
    movePaddle();
    moveBall();
}

function renderLoop() {
    renderGame();
    statemachine();
    requestAnimationFrame(renderLoop);
    spawner();
    frames++;
}

function physicsLoop() {
    setInterval(() => {
        if (statemachine() == 'running') {
            movement();
        }
    }, 1000 / 480); // 480 frames per second
}

//create ui loop
renderLoop();

// start the game
physicsLoop();