import { musik, paddle,stars,ball,states,buffer,mainBuffer,optionBuffer, effekt, ctrBuffer, scoreBuffer,life,score,scoreText,leaderboard} from "../controller/gameloop.js";


export const canvas = document.querySelector('canvas')
export const ctx = canvas.getContext("2d")

canvas.style.imageRendering = "pixelated";
const ctrl = new Image;
ctrl.src = './assets/ctrl/constrolsSpriteSheet.png';
const spriteW = 16800 / 56
const spriteH = 250;
let framex = 16;
let gameframe = 0;
let rotationAngle = 0;
let textX = canvas.width / 2;
let textY = canvas.height / 2;



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
        } else if (buffer[i].name === 'fat') {
            const dome = new Image();
            dome.src = './assets/enemy/dome.png'
            image.src = './assets/enemy/shipGreen_manned.png';
            ctx.drawImage(image,buffer[i].position.x,buffer[i].position.y,buffer[i].size.width,buffer[i].size.height)
            if (buffer[i].health > 1) {
                ctx.drawImage(dome,buffer[i].position.x,buffer[i].position.y,buffer[i].size.width,buffer[i].size.height)
            }
        } 
        else {
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
function renderPddle(paddle) {
    ctx.fillStyle = 'red';
    ctx.fillRect(paddle.position.x, paddle.position.y-15, paddle.width, paddle.height+5);
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
            ctx.fillText(Button.name, Button.position.x / 3, Button.position.y+Button.dimentions.height/2+15);
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
            ctx.fillText(Button.name, Button.position.x/3.2, Button.position.y+Button.dimentions.height/2+15);
        }
        else if (Button.type == 'button') {
            const image = new Image()
            image.src = './assets/icons/ButtonNormal.png'
            ctx.drawImage(image,Button.position.x,Button.position.y,Button.dimentions.width,Button.dimentions.height)
            ctx.fillStyle = 'white';
            ctx.font = "40px Georgia";
            const textWidth = ctx.measureText(Button.name).width;
            ctx.fillText(Button.name, Button.position.x + Button.dimentions.width / 2 - textWidth / 2, Button.position.y+Button.dimentions.height/2+15);
        }
        else {
            ctx.fillStyle = 'red';
            ctx.fillRect(Button.position.x, Button.position.y, Button.dimentions.width, Button.dimentions.height);
            //console.log(Button);
            ctx.fillStyle = 'white';
            ctx.font = "48px Georgia";
            const textWidth = ctx.measureText(Button.name).width;
            ctx.fillText(Button.name, Button.position.x + Button.dimentions.width / 2 - textWidth / 2, Button.position.y+Button.dimentions.height/2);
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

function renderHearts() {
    for(let i = 0;i<life;i++) {
        ctx.fillStyle = 'red';
        ctx.fillRect(0+i*25, 0, 20, 20);
    }
}

function renderScore() {
    ctx.fillText(score, canvas.width/2, 30);
}

function renderScoreText() {
    let scoreT = 100;
    scoreText.forEach(particle => {
        ctx.save();
        ctx.fillText(scoreT, particle.position.x, particle.position.y);
        ctx.globalAlpha = particle.opacity;
        ctx.restore();
    })
}

function renderTop() {
    for (let i = 0; i < Math.min(leaderboard.length, 3); i++) {
        const entry = leaderboard[i];
        const text = `${i + 1}. ${entry.name} ${entry.score}`;
      
        const maxFontSize = 70;
        const minFontSize = 30;
        const fontSize = maxFontSize - i * (maxFontSize - minFontSize) / 2;
      
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = i === 0 ? "gold" : (i === 1 ? "silver" : "peru");
      
        const textWidth = ctx.measureText(text).width;
        const x = canvas.width / 2 - textWidth / 2;
        const y = canvas.height / 3 + i * 70;
      
        ctx.fillText(text, x, y);
      }
}
function mainText() {
    ctx.save();
    ctx.translate(textX, textY);
    ctx.rotate(rotationAngle * Math.PI / 180);
    ctx.textAlign = "center";
    ctx.fillText("Alien Break", 0, 0);
    ctx.restore();
    
    // Update the rotation angle and position
    rotationAngle += 2;
    textX += Math.sin(rotationAngle * Math.PI / 180);
    textY += Math.cos(rotationAngle * Math.PI / 180);
}
// render on screen
export function renderGame() {
    clearCanvas();
    renderScoreText();
    renderScore();
    renderHearts();
    renderParticles();
    renderPaddle(paddle);
    renderPddle(paddle)
    renderBall(ball);
    renderEnemy();
}

export function renderOptions() {
    clearCanvas();
    renderButton(optionBuffer);
}

export function renderLeader() {
    clearCanvas();
    renderButton(scoreBuffer);
    renderTop();
}

export function renderMainMenu() {
    clearCanvas();
    mainText();
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