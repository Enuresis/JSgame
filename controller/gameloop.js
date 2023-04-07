import {renderGame} from "../view/renderer.js";
import {Paddle} from "../model/paddle.js";
import {canvas} from "../view/renderer.js";
import {Ball} from "../model/ball.js";
import {Vector} from "../model/vector.js";
import { Enemy } from "../model/enemy.js";
import { updateOverlay } from "../view/renderer.js";
import { renderMainMenu } from "../view/renderer.js";
import { Button } from "../model/button.js";
import { Sound } from "../model/sound.js";

let rightPressed = false;
let leftPressed = false;
let frames = 0;
let mousePos;
let buttonPressed;
let inter;
export let buffer = [];
export let mainBuffer = [];
export const states = {
    main: true,
    paused: false,
    run: false,
    running: false
}

// create paddle object and ball object
export const paddle = new Paddle(100,6);
export const ball = new Ball(10,3);
const soundTrack = new Sound("../assets/sounds/musik.mp3");

function soundManager() {
    if (states.paused == false) {
        soundTrack.play();
    }
    if (states.paused == true) {
        soundTrack.stop();
    }
}

// spawner enemy
function spawner() {
    if(frames % 500 === 0) {
        buffer.push(new Enemy({position: {x: randN(3,(canvas.width)-50),y: 0},size:{width: 50,height:50}},0.2,2));
        frames = 0;
    }
}

// get the index of a button and change state machine
canvas.addEventListener("click", function (evt) {
    mousePos = getMousePos(evt);
    mainBuffer.forEach((Button)=> {
        if (Button.position.x < mousePos.x && Button.position.x + Button.dimentions.width > mousePos.x && Button.position.y < mousePos.y && Button.position.y+Button.dimentions.height > mousePos.y) {
            if (Button.index == 0) {
                states.run = true;
                states.main = false;
                statemachine();
                startGame();
            }
        }
    });
}, false);

// create main menu
function mainMenu() {
    function createMain() {
        let numB = 3;
        for(let i = 0;i< numB;i++) {
            let btn = (new Button({position:{x:canvas.width/2-75,y:canvas.height/2 + 80*i-75},dimentions:{width:150,height:75}},'HEJ'))
            btn.index = i;
            mainBuffer.push(btn);
        }
    }
    createMain();
}
// get coords relative to canvas
function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function randN(min, max) {
    return Math.random() * (max - min) + min;
}
// escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if(states.main == false) {
        states.paused = !states.paused;
      } 
        updateOverlay();
    }
});
// switch to main menu and create it
document.addEventListener("DOMContentLoaded", (event) => {
    states.main = true;
    mainMenu();
});
// handle states
function statemachine() {
    if (states.paused) {
        return 'paused';
    }
    else if (states.main) {
        return 'menu';
    }
    else if (states.run) {
        //console.log("heej");
        return 'running';
    }
}
// detect collision between rectangels
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
    function moveEnemy() {
        buffer.forEach((Enemy,index) => {
            
            if(Enemy.position.y > canvas.height) {
                buffer.splice(index,1)
            } else {
                Enemy.move('crazy');
            }
        })
    }
    // call individual moves
    moveEnemy();
    movePaddle();
    moveBall();
}

// update state based on statemachine mozno som kokot ale takto to ide
function startGame() {
if (states.run == true && states.running == false) {
    console.log('LEN RAZ')
    states.running = true;

    function GameLoop() {
        renderGame();
        requestAnimationFrame(GameLoop);
        if(states.paused == false) {
            spawner();
            frames++;
        }
        //console.log("runnning")
    }

    function physicsGameLoop() {
        let lastTimestamp = 0;
        function loop(timestamp) {
            const deltaTime = (timestamp - lastTimestamp) / 1000; // convert to seconds
            lastTimestamp = timestamp;
    
            if (!states.paused) {
                movement(deltaTime);
                soundManager(true);
            } else {
                soundManager(false);
            }

            requestAnimationFrame(loop);

        }
        requestAnimationFrame(loop);
    }

    //create ui loop
    GameLoop();

    // start the game
    physicsGameLoop();
}

}
if (states.main == true) {
    function Menu() {
        requestAnimationFrame(Menu);
        renderMainMenu();
    }
    Menu();
}

