import { canvas } from "../view/renderer.js";

// create the paddle class
export class Paddle {
    constructor(size, moveSpeed) {
        this.position = {
            x: canvas.width/2,
            y: canvas.height - 40
        }
        this.width = size;
        this.height = 10;
        this.moveSpeed = moveSpeed;
        this.velocity = {
            x: 0,
            y: 0
        }
    }
    moveLeft() {
        this.position.x -= this.moveSpeed;
    }
    moveRight() {
        this.position.x += this.moveSpeed;
    }
}