import { canvas } from "../view/renderer.js"

export class Ball {
    constructor(radius, speed) {
        this.damage = 10;
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
}