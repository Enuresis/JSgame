export class Particle {
    constructor({position, velocity},radius,color,sparkle) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color
        this.opacity = 1;
        this.sparkle = sparkle;
    }
}