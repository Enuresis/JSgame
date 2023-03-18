import {renderGame} from "../view/renderer.js";
import {Paddle} from "../model/paddle.js";
import { canvas } from "../view/renderer.js";
import {Ball} from "../model/ball.js";
import { Vector } from "../model/vector.js";

let rightPressed = false;
let leftPressed = false;

// create paddle object
export const paddle = new Paddle(100,2);
export const ball = new Ball(10,2);

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

        if (position.x < 0 || position.x + ball.radius > canvas.width) {
            velocity = velocity.reflect(new Vector(-1, 0));
        }
        if (position.y < 0) {
            velocity = velocity.reflect(new Vector(0, -1));
        }
        if (position.y + ball.radius > canvas.height) {
            velocity = velocity.reflect(new Vector(0, -1));
        }

        const paddleTopLeft = new Vector(paddle.position.x, paddle.position.y);
        const paddleTopRight = new Vector(paddle.position.x + paddle.width, paddle.position.y);
        const ballBottomLeft = new Vector(position.x, position.y + ball.radius);
        const ballBottomRight = new Vector(position.x + ball.radius, position.y + ball.radius);
        if (ballBottomLeft.y > paddleTopLeft.y && ballBottomLeft.y < paddleTopLeft.y + paddle.height &&
            ballBottomLeft.x > paddleTopLeft.x && ballBottomRight.x < paddleTopRight.x) {
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


function gameLoop() {

    renderGame();
    movement();
    console.log(paddle.position.x)
    requestAnimationFrame(gameLoop);
}



// start the game
gameLoop();