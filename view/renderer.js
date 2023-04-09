import { musik, paddle,stars,ball,states,buffer,mainBuffer,optionBuffer, effekt, ctrBuffer} from "../controller/gameloop.js";


export const canvas = document.querySelector('canvas')
export const ctx = canvas.getContext("2d")

canvas.style.imageRendering = "pixelated";
const ctrl = new Image();
ctrl.src = './assets/ctrl/constrolsSpriteSheet.png';
const spriteW = 16800 / 56
const spriteH = 250;
let framex = 0;
let gameframe = 0;

//clear the canvas
function clearCanvas() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

function renderEnemy() {
    for(let i = 0;i< buffer.length;i++) {
        const image = new Image();
        if (buffer[i].name === 'crazy') {
            image.src = './assets/enemy/shipYellow_manned.png';
            //ctx.fillRect(buffer[i].position.x, buffer[i].position.y, buffer[i].size.width, buffer[i].size.height);
            ctx.drawImage(image,buffer[i].position.x,buffer[i].position.y,buffer[i].size.width,buffer[i].size.height)
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(buffer[i].position.x, buffer[i].position.y, buffer[i].size.width, buffer[i].size.height);
        }
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
export function updateOverlay(type) {
    if (type == 'over') {
        if (states.over) {
            document.getElementById("over").style.display = "block";
        } else {
            document.getElementById("over").style.display = "none";
        }
    } else {
        if (states.paused) {
            document.getElementById("overlay").style.display = "block";
        } else {
            document.getElementById("overlay").style.display = "none";
        }
    }
}

function renderButton(buffer) {
    buffer.forEach((Button) => {
        if (Button.type == 'sound') {
            const image = new Image()
            if (musik) {
                image.src = './assets/icons/35.png'
            } else {
                image.src = './assets/icons/34.png'
            }
            ctx.drawImage(image,Button.position.x,Button.position.y,Button.dimentions.width,Button.dimentions.height)
            ctx.fillStyle = 'white';
            ctx.font = "40px Georgia";
            ctx.fillText(Button.name, Button.position.x - 200, Button.position.y+Button.dimentions.height/2+15);
        } 
        else if (Button.type == 'effects') {
            const image = new Image()
            if (effekt) {
                image.src = './assets/icons/35.png'
            } else {
                image.src = './assets/icons/34.png'
            }
            ctx.drawImage(image,Button.position.x,Button.position.y,Button.dimentions.width,Button.dimentions.height)
            ctx.fillStyle = 'white';
            ctx.font = "40px Georgia";
            ctx.fillText(Button.name, Button.position.x - 200, Button.position.y+Button.dimentions.height/2+15);
        }
        else if (Button.type == 'button') {
            const image = new Image()
            image.src = './assets/icons/ButtonNormal.png'
            ctx.drawImage(image,Button.position.x,Button.position.y,Button.dimentions.width,Button.dimentions.height)
            ctx.fillStyle = 'white';
            ctx.font = "40px Georgia";
            ctx.fillText(Button.name, Button.position.x, Button.position.y+Button.dimentions.height/2+15);
        }
        else {
            ctx.fillStyle = 'red';
            ctx.fillRect(Button.position.x, Button.position.y, Button.dimentions.width, Button.dimentions.height);
            //console.log(Button);
            ctx.fillStyle = 'white';
            ctx.font = "48px Georgia";
            ctx.fillText(Button.name, Button.position.x+Button.dimentions.width/2, Button.position.y+Button.dimentions.height/2);
        }
    });
    //console.log(mainBuffer);
}

function renderParticles() {
    stars.forEach(particle => {
        ctx.save()
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath()
        ctx.arc(particle.position.x,particle.position.y,particle.radius,0,Math.PI*2)
        ctx.fillStyle = particle.color
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    });
}

// render on screen
export function renderGame() {
    clearCanvas();
    renderParticles();
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
export function renderControls() {
    clearCanvas();
    renderButton(ctrBuffer);
    ctx.drawImage(ctrl,framex* spriteW,0,spriteW,spriteH,0,0,spriteW*2.4,spriteH*2);
    if (gameframe % 9 == 0) {
        if (framex < 55) framex++;
        else framex = 0;
        gameframe = 0;
    }
    gameframe++;
}