export const canvas = document.querySelector('canvas')
export const ctx = canvas.getContext("2d")

export class Particle {
    constructor({position, velocity},radius,color,sparkle) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color
        this.opacity = 1;
        this.sparkle = sparkle;
    }
    fade() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.restore();
    }
}