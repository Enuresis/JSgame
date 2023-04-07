let canvas = document.querySelector('canvas')
let ctx = canvas.getContext("2d")

let rightPressed = false;
let leftPressed = false;

class Paddle {
    constructor(size, moveSpeed) {
        this.position = {
            x: canvas.width/2,
            y: canvas.height - 20
        }
        this.width = size
        this.height = 10
        this.moveSpeed = moveSpeed
        this.velocity = {
            x: 0,
            y: 0
        }   
    }
    draw() {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        
        if(rightPressed) {
            this.position.x += this.moveSpeed;
            if (this.position.x + this.width > canvas.width){
                this.position.x = canvas.width - this.width;
            }
        }
        else if(leftPressed) {
            this.position.x -= this.moveSpeed;
            if (this.position.x < 0){
                this.position.x = 0;
            }
        }
    }
}

class Ball {
    constructor(radius, speed) {
        this.position = {
            x: canvas.width/2,
            y: canvas.height / 2
        }
        this.radius = radius
        this.speed = speed
        this.velocity = {
            x: speed,
            y: -speed
        }
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = "#0095DD"
        ctx.fill()
        ctx.closePath()
        ctx.beginPath()
        ctx.moveTo(this.position.x, this.position.y)
        ctx.lineTo(this.position.x + this.velocity.x * this.radius, this.position.y + this.velocity.y * this.radius)
        ctx.stroke()
    }

    checkPaddleCol(paddle) {
        const hitPaddle = () => 
        this.position.y + 2 * this.radius > canvas.height - paddle.height &&
        this.position.y + this.radius < canvas.height && 
        this.position.x + this.radius > paddle.position.x  &&
        this.position.x + this.radius < paddle.position.x + paddle.width ;

        if (hitPaddle()) {
            this.velocity.x = this.velocity.x + 3;
            this.velocity.y = this.velocity.y + 3;
            this.velocity.y = -this.velocity.y;
        }
    }

    update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.draw()
        if (this.position.x + this.velocity.x > canvas.width - this.radius || this.position.x + this.velocity.x < this.radius) {
            if (this.velocity.x > this.speed) {
                this.velocity.x = this.velocity.x - 1;
            }
            this.velocity.x = -this.velocity.x
        }
        if (this.position.y + this.velocity.y > canvas.height - this.radius || this.position.y + this.velocity.y < this.radius) {
            if ( this.velocity.y > this.speed) {
                this.velocity.y = this.velocity.y - 1;
            }
            this.velocity.y = -this.velocity.y
        }

        this.checkPaddleCol(paddle)

        if (this.velocity.x > this.speed) {
            this.velocity.x = this.velocity.x - .01;
        }
        if ( this.velocity.y > this.speed) {
            this.velocity.y = this.velocity.y - .01;
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

// input handler
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    }
}
  
function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    }
}
  
// instace objects 
const ball = new Ball(10, 2)
const paddle = new Paddle(75, 4)

// animate objects
function animate() {
    window.requestAnimationFrame(animate)
    
    ball.update()
    paddle.update()
    //console.log(paddle.position)
}
animate()