import {renderGame,canvas,updateOverlay,renderMainMenu,renderOptions, renderControls,renderLeader} from "../view/renderer.js";
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
let invTimeout;
let invincible = false;
let frames = 0;
let mousePos;
let advancment = 0;
let spawnInterval = 500;
let chance = 1.00;
let kokot;
export let score = 0;
export let musik = true;
export let effekt = true;
let pauseGameLoop;
let optionBtn = document.getElementById('options');
export let stars = [];
export let buffer = [];
export let optionBuffer = [];
export let mainBuffer = [];
export let ctrBuffer = [];
export let scoreBuffer = [];
export let scoreText = [];
export let leaderboard;
let ballS= 10;
export const states = {
    main: true,
    paused: false,
    run: false,
    running: false,
    options: false,
    optionsR: false,
    over: false,
    controls: false,
    score: false,
    time: false
}
export let life = 3;
let buttonNames = ['PLAY', 'OPTIONS', 'CONTROLS', 'SCORE'];

// create paddle object and ball object
export const paddle = new Paddle(100,6);
export const ball = new Ball(10,ballS);
const soundTrack = new Sound("/game/assets/sounds/musik.mp3");
soundTrack.setVolume(0.2);

export function updateLeaderboard(name) {
    leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    
    leaderboard.push({ name, score });
    
    leaderboard.sort((a, b) => b.score - a.score);
    
    leaderboard = leaderboard.slice(0, 3);
    
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    kokot = leaderboard.map(entry => `${entry.name}: ${entry.score}`);
}

function bulletTime() {
    document.addEventListener("keydown", function (evt) {
        if (evt.code === 'Space') {
            if (ball.position.x-ball.radius < paddle.position.x+paddle.width && ball.position.x+ball.radius > paddle.position.x && ball.position.y+ball.radius < paddle.position.y+paddle.height+10 && ball.position.y+ball.radius > paddle.position.y -15) {
                states.time = true;
                ball.position.x = paddle.position.x + paddle.width/2;
                ball.position.y = paddle.position.y - 30
            }
        }
    });
    
    canvas.addEventListener("click", function (evt) {
        if (states.time) {
            states.time = false
        }
    },false)
}

function dlife() {
    buffer.forEach((Enemy,index) => {
        if(Enemy.position.y > canvas.height) {
            if (life > 0) {
                life -= 0;
            }
            buffer.splice(index,1)
        }
    })
    if(life == 0) {
        if (states.main == false && states.options == false && states.paused == false && states.controls == false && states.score == false) {
            states.over = true
        }
        updateOverlay('over');
    }
}

function soundManager(option) {
    if (states.paused == false || states.over == false && option == true) {
        soundTrack.play();
    }
    if (states.paused == true || option == false || states.over == true) {
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
    let crazy = 2;
    let fat = 1;
    let chosenValue = Math.random() < chance ? crazy : fat;
    if(frames % spawnInterval === 0) {
        if (chosenValue == 2) {
            buffer.push(new Enemy({position: {x: randN(3,(canvas.width)-50),y: 0},size:{width: 50,height:50}},0.2,2,1));
            //console.log(chance)
            //console.log(advancment)
        }
        if (advancment > 1 && chosenValue == 2) {
            buffer.push(new Enemy({position: {x: randN(3,(canvas.width)-50),y: 0},size:{width: 50,height:50}},0.2,1,2));
            //console.log(chance)
        }
        if (chance > 0.2 && advancment > 8) {
            chance = chance-0.05;
        }
        //console.log(spawnInterval)
        if (spawnInterval > 200) {
            spawnInterval -= 5;
        }
        advancment++;
        frames = 0;
    }
}

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
                    states.controls = false;
                    optionsMenu();
                    startGame();
                } else if (Button.index == 2) {
                    states.controls = true;
                    states.run = false;
                    states.options = false;
                    states.main = false;
                    console.log(states.run)
                    controlMenu();
                    startGame();
                } else if (Button.index == 3) {
                    states.score = true
                    states.controls = false;
                    states.run = false;
                    states.options = false;
                    states.main = false;
                    console.log(states.run)
                    leaderMenu();
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
    if (states.controls == true) {
        ctrBuffer.forEach((Button)=> {
            if (Button.position.x < mousePos.x && Button.position.x + Button.dimentions.width > mousePos.x && Button.position.y < mousePos.y && Button.position.y+Button.dimentions.height > mousePos.y) {
                if (Button.index == 0) {
                    states.main = true;
                    states.controls = false;
                    ctrBuffer.splice(0,1);
                    startGame();
                }
                if (effekt === true) {
                    const click = new Sound('./assets/sounds/Click.mp3');
                    click.play();
                }
            }
        });
    }
    if (states.score == true) {
        scoreBuffer.forEach((Button)=> {
            if (Button.position.x < mousePos.x && Button.position.x + Button.dimentions.width > mousePos.x && Button.position.y < mousePos.y && Button.position.y+Button.dimentions.height > mousePos.y) {
                if (Button.index == 0) {
                    states.main = true;
                    states.score = false;
                    scoreBuffer.splice(0,1);
                    startGame();
                }
                if (effekt === true) {
                    const click = new Sound('./assets/sounds/Click.mp3');
                    click.play();
                }
            }
        });
    }
}, false);

function leaderMenu() {
    let btn = (new Button({position:{x:20,y:canvas.height - 200},dimentions:{width:150,height:75}},'BACK','button'));
    btn.index = 0;
    scoreBuffer.push(btn);
}

function controlMenu() {
    let btn = (new Button({position:{x:20,y:canvas.height - 200},dimentions:{width:150,height:75}},'BACK','button'));
    btn.index = 0;
    ctrBuffer.push(btn);
}

function moveScoreParticles() {
    scoreText.forEach((particle,index) => {
        particle.position.x += particle.velocity.x;
        particle.position.y += particle.velocity.y;
        particle.opacity -= 0.02;
        //particle.fade();

        if (particle.opacity < 0) {
            scoreText.splice(index,1);
        }
    })
}

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
    let e = new Button({position:{x:canvas.width/2-75,y:canvas.height/6},dimentions:{width:62,height:52}},'EFFECTS', 'effects');
    e.index = numB+1;
    optionBuffer.push(e);
}
// create main menu
function mainMenu() {
    let numB = 4;
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

document.addEventListener('keydown',(event) => {
    if (event.key === 'g') {
        if (states.main == false && states.options == false && states.paused == false && states.controls == false && states.score == false) {
            states.over = true
        }
        updateOverlay('over');
    }
});

// escape key pAUSE
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if(states.main == false && states.options == false && states.over == false && states.controls == false && states.score == false) {
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
document.addEventListener('keydown', (event) => {
    if (event.key === 'a') {
        leftPressed = true;
    } else if (event.key === 'd') {
        rightPressed = true;
    }
});
document.addEventListener('keyup', (event) => {
    if (event.key === 'a') {
        leftPressed = false
    } else if (event.key === 'd') {
        rightPressed = false
    }
});
// detect collision between rectangels
function collision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}
canvas.addEventListener('click', function(event) {
    if (states.time) {
        let mousep = getMousePos(event); 
        const targetPosition = new Vector(mousep.x, mousep.y);
        const direction = targetPosition.subtract(ball.position).normalize();
        ball.velocity.x += 15;
        ball.velocity.y += 15;
        const speed = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y);
        ball.velocity = direction.scale(speed);
    }
}, false);
// handle movement for objects and delete enemy upon collision
function movement() {
    function movePaddle() {
        if (leftPressed && paddle.position.x > 0) {
            paddle.moveLeft();
        }
        if (rightPressed && paddle.position.x + paddle.width < canvas.width) {
            
            paddle.moveRight();
        }
        
        
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
        
        if (states.time == false) {
            ball.velocity = velocity.scale(0.98);
            if (velocity.magnitude() < ball.speed) {
              ball.velocity = velocity.normalize().scale(ball.speed);
            }
        }
    }
    function moveEnemy() {
        buffer.forEach((Enemy,index) => {
            if (ball.position.x-ball.radius < Enemy.position.x+Enemy.size.width && ball.position.x+ball.radius > Enemy.position.x && ball.position.y+ball.radius < Enemy.position.y+Enemy.size.height && ball.position.y+ball.radius > Enemy.position.y) {
                    if (Enemy.name == 'fat') {
                        if (invincible == false) {
                            Enemy.health--;
                            if (Enemy.health < 0) {
                                score += 100;
                                buffer.splice(index,1)
                                scoreText.push(new Particle({position: {x:Enemy.position.x,y:Enemy.position.y},velocity:{x:-0.5,y:-0.5}},Math.random()*1,'white'))
                            }
                            console.log("JAKK")
                            invincible = true
                        }
                    }
                    if (Enemy.name == 'crazy') {
                        Enemy.health--;
                            if (Enemy.health < 0) {
                                score += 100;
                                buffer.splice(index,1)
                                scoreText.push(new Particle({position: {x:Enemy.position.x,y:Enemy.position.y},velocity:{x:-0.5,y:-0.5}},Math.random()*1,'white'))
                            }
                    }
                    //console.log('LOOOL')                
            }
            else if(Enemy.position.y > canvas.height) {
                buffer.splice(index,1)
            } else {
                if (Enemy.name == 'crazy') {
                    Enemy.move('crazy');
                } else {
                    Enemy.move('fat');
                }
            }
            
        })
        if (!invTimeout) {
            invTimeout = setTimeout (()=> {
                invincible = false
                invTimeout = null
            }, 50);
        }
        
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
    // empty all buffers
    optionBuffer.splice(0,3);
    ctrBuffer.splice(0,1);
    
    // render game
    GameLoop();
    // start the game
    physicsGameLoop();
    spawnStars();
}
    function GameLoop() {
        renderGame();
        pauseGameLoop = requestAnimationFrame(GameLoop);
        if(states.paused == false && states.over == false && states.time == false) {
            spawner();
            dlife();
            frames++;
        }
    }

    function physicsGameLoop() {
        let lastTimestamp = 0;
        function loop(timestamp) {
            const deltaTime = (timestamp - lastTimestamp) / 1000; 
            lastTimestamp = timestamp;
            bulletTime();
            console.log(kokot)
            if (!states.paused && !states.over && !states.time) {
                moveScoreParticles();
                movement(deltaTime);
                soundManager(musik);
            } else {
                soundManager(musik);
            }

            requestAnimationFrame(loop);

        }
        requestAnimationFrame(loop);
    }

if(states.options == false && states.main == false && states.controls == false && states.score == false) {
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
        console.log(kokot)
        renderMainMenu();
    }
    Menu();
}
if (states.controls == true) {
    function ctr() {
        requestAnimationFrame(ctr)
        renderControls();
    }
    ctr();
}
if (states.score == true) {
    function scr() {
        requestAnimationFrame(scr);
        renderLeader();
    }
    scr();
}

}
startGame();