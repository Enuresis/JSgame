import { musik, paddle,stars,ball,states,buffer,mainBuffer,optionBuffer, effekt, ctrBuffer, scoreBuffer,life,score,scoreText,leaderboard,explosions} from "../controller/gameloop.js";


export const canvas = document.querySelector('canvas')
export const ctx = canvas.getContext("2d")
canvas.style.imageRendering = "pixelated";
const inst = new Image;
inst.src = './assets/ctrl/INSCTRUCTIONS.png';
const catch_zone = new Image();
catch_zone.src = './assets/paddle/catch_zone.png'
const heart = new Image();
heart.src = './assets/icons/lifeeees.png'
const explosionImage = new Image();
explosionImage.src = "./assets/enemy/yellow_effects.png";
const title = new Image();
title.src = './assets/title/Alien_Break.png'
export let rottext;
const explosionFrames = [
    {x: 544, y: 384},
    {x: 576, y: 384},
    {x: 608, y: 384},
    {x: 640, y: 384}
];

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
    //ctx.fillStyle = 'blue';
    //ctx.fillRect(paddle.position.x, paddle.position.y-50, paddle.width, paddle.height+40);
    ctx.drawImage(catch_zone,paddle.position.x,paddle.position.y-catch_zone.height);
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
        ctx.drawImage(heart,0+i*50,0,heart.width,heart.height);
    }
}
function renderExplosion() {
    explosions.forEach((explosion, index) => {
        explosion.frameCount++;

        if (explosion.frameCount % 10 == 0) {
          explosion.frameIndex++;
        }
      
        if (explosion.frameIndex >= explosionFrames.length) {
          explosions.splice(index, 1);
        } else {

          const frame = explosionFrames[explosion.frameIndex];
          ctx.drawImage(
            explosionImage,
            frame.x,
            frame.y,
            32,
            32,
            explosion.position.x,
            explosion.position.y,
            32*2,
            32*2
          );
        }
    })
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
      ctx.translate(canvas.width/2, canvas.height / 5);
      ctx.drawImage(title, -title.width / 2, -title.height / 2);
      ctx.restore();
  }
// render on screen
export function renderGame() {
    clearCanvas();
    renderExplosion();
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
    ctx.fillStyle = 'gray'
    ctx.fillRect(20,20,canvas.width-40,500);
    ctx.drawImage(inst,20,20)
}