import {renderGame,canvas,updateOverlay,renderMainMenu,renderOptions} from "../view/renderer.js";
import {Paddle} from "../model/paddle.js";
import {Ball} from "../model/ball.js";
import {Vector} from "../model/vector.js";
import {Enemy} from "../model/enemy.js";
import {Button} from "../model/button.js";
import {Sound} from "../model/sound.js";
import { Particle } from "../model/particle.js";


let rightPressed = false;
let leftPressed = false;
let twinke = false;
let frames = 0;
let mousePos;
export let musik =true;
export let effekt = true;
let pauseGameLoop;
let optionBtn = document.getElementById('options');
export let stars = [];
export let buffer = [];
export let optionBuffer = [];
export let mainBuffer = [];
export const states = {
    main: true,
    paused: false,
    run: false,
    running: false,
    options: false,
    optionsR: false
}
let buttonNames = ['PLAY', 'OPTIONS', 'CONTROLS']

// create paddle object and ball object
export const paddle = new Paddle(100,6);
export const ball = new Ball(10,3);
const soundTrack = new Sound("../assets/sounds/musik.mp3");
soundTrack.setVolume(0.2);


function soundManager(option) {
    if (states.paused == false && option == true) {
        soundTrack.play();
    }
    if (states.paused == true || option == false) {
        soundTrack.stop();
    }
}

optionBtn.addEventListener('click', () => {
    if(states.running == true && states.paused == true) {
        states.paused = false;
        updateOverlay();
        states.paused = true;
        states.options = true;
        states.optionsR = true;
        optionsMenu();
        startGame();
    }
});

function spawnStars() {
    for (let i = 0;i < 1000;i++) {
        if (Math.round(Math.random())== 1) {
            twinke = true;
        } else {
            twinke = false
        }
        stars.push(new Particle({position: {x:Math.random()* canvas.width,y:Math.random() * canvas.height},velocity:{x:0,y:0}},Math.random()*1,'white',twinke))
    }
}

// spawner enemy
function spawner() {
    if(frames % 1000 === 0) {
        buffer.push(new Enemy({position: {x: randN(3,(canvas.width)-50),y: 0},size:{width: 50,height:50}},0.2,2));
        frames = 0;
    }
}

// get the index of a button and change state machine
canvas.addEventListener("click", function (evt) {
    mousePos = getMousePos(evt);
    if (states.main == true) {
        mainBuffer.forEach((Button)=> {
            if (Button.position.x < mousePos.x && Button.position.x + Button.dimentions.width > mousePos.x && Button.position.y < mousePos.y && Button.position.y+Button.dimentions.height > mousePos.y) {
                if (Button.index == 0) {
                    states.run = true;
                    states.main = false;
                    startGame();
                } else if (Button.index == 1) {
                    states.options = true;
                    states.run = false;
                    states.main = false;
                    optionsMenu();
                    startGame();
                }
                if (effekt === true) {
                    const click = new Sound('./assets/sounds/Click.mp3');
                    click.play();
                }
            }
        });
    }
    if (states.options == true) {
        optionBuffer.forEach((Button)=> {
            if (Button.position.x < mousePos.x && Button.position.x + Button.dimentions.width > mousePos.x && Button.position.y < mousePos.y && Button.position.y+Button.dimentions.height > mousePos.y) {
                if (Button.index == 0 && states.optionsR == true) {
                    states.options = false;
                    states.optionsR = false
                    //states.running = false
                    optionBuffer.splice(0,3);
                    states.paused = false;
                    startGame();
                }
                else if (Button.index == 0) {
                    states.main = true;
                    states.options = false;
                    optionBuffer.splice(0,3);
                    startGame();
                }
                if(Button.index == 1) {
                    musik = !musik
                    console.log("musik "+musik)
                }
                else if(Button.index == 2) {
                    effekt = !effekt
                    console.log("effkt " + effekt)
                }
                if (effekt === true) {
                    const click = new Sound('./assets/sounds/Click.mp3');
                    click.play();
                }
            }
        });
        
    }
}, false);

function optionsMenu() {
    let numB = 1
    for(let i = 0; i < numB; i++) {
        let btn = (new Button({position:{x:20,y:canvas.height - 200},dimentions:{width:150,height:75}},'BACK','button'));
        btn.index = i;
        optionBuffer.push(btn);
    }
    let s = new Button({position:{x:canvas.width/2-75,y:canvas.height/3},dimentions:{width:62,height:52}},'SOUND', 'sound');
    s.index = numB;
    optionBuffer.push(s);
    let e = new Button({position:{x:canvas.width/2-75,y:canvas.height/6},dimentions:{width:62,height:52}},'SOUND', 'effects');
    e.index = numB+1;
    optionBuffer.push(e);
}

// create main menu
function mainMenu() {
    let numB = 3;
    for(let i = 0;i< numB;i++) {
        let btn = (new Button({position:{x:canvas.width/2-114,y:canvas.height/2 + 100*i-100},dimentions:{width:228,height:76}},buttonNames[i],'button'))
        btn.index = i;
        mainBuffer.push(btn);
    }
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
      if(states.main == false && states.options == false) {
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

// handle movement for objects and delete enemy upon collision
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
            if (ball.position.x-ball.radius < Enemy.position.x+Enemy.size.width && ball.position.x+ball.radius > Enemy.position.x && ball.position.y+ball.radius < Enemy.position.y+Enemy.size.height && ball.position.y+ball.radius > Enemy.position.y) {
                buffer.splice(index,1)
            }
            else if(Enemy.position.y > canvas.height) {
                buffer.splice(index,1)
            } else {
                Enemy.move('crazy');
            }
        })
    }
    function moveStars() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const startTime = performance.now() / 1000;
        const rotationSpeed = Math.PI / 2;

        stars.forEach(particle => {
            const rate = Math.round(randN(2, 8));
            const distance = Math.sqrt((particle.position.x - centerX) ** 2 + (particle.position.y - centerY) ** 2);
            const currentAngle = Math.atan2(particle.position.y - centerY, particle.position.x - centerX);
            const timeElapsed = (performance.now()/1000)-startTime;
            const newAngle = currentAngle + (timeElapsed*rotationSpeed) / 2;
            const newX = centerX + distance * Math.cos(newAngle);
            const newY = centerY + distance * Math.sin(newAngle);
            particle.position.x = newX;
            particle.position.y = newY;

            if (particle.sparkle && rate % 8 === 0) {
                particle.radius = randN(particle.radius - particle.radius / 5, particle.radius + 0.2);
            } else if (rate % 16 === 0) {
                particle.radius = randN(particle.radius - particle.radius / 5, particle.radius + 0.2);
            }
        });
    }
    // call individual moves
    moveEnemy();
    movePaddle();
    moveBall();
    moveStars();
}

// update state based on statemachine mozno som kokot ale takto to ide
function startGame() {
if (states.run == true && states.running == false) {
    //console.log('LEN RAZ')
    states.running = true;
    
    // render game
    GameLoop();

    // start the game
    physicsGameLoop();
    spawnStars();
}
    function GameLoop() {
        renderGame();
        pauseGameLoop = requestAnimationFrame(GameLoop);
        if(states.paused == false) {
            spawner();
            frames++;
        }
    }

    function physicsGameLoop() {
        let lastTimestamp = 0;
        function loop(timestamp) {
            const deltaTime = (timestamp - lastTimestamp) / 1000; 
            lastTimestamp = timestamp;
    
            if (!states.paused) {
                movement(deltaTime);
                soundManager(musik);
            } else {
                soundManager(musik);
            }

            requestAnimationFrame(loop);

        }
        requestAnimationFrame(loop);
    }

if(states.options == false && states.main == false) {
    cancelAnimationFrame(pauseGameLoop)
    GameLoop();
}
if (states.options == true) {
    function Options() {
        requestAnimationFrame(Options);
        renderOptions();
    }
    Options();
}

if (states.main == true) {
    function Menu() {
        requestAnimationFrame(Menu);
        renderMainMenu();
    }
    Menu();
}

}
startGame();