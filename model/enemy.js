export class Enemy {
    constructor({position,size}, speed, nameI,health) {
        this.position = position;
        this.size = size;
        let type = ['fast','fat','crazy'];
        this.name = type[nameI];
        this.velocity = {
            x:0,
            y:0
        }
        this.speed = speed;
        this.angle = 0;
        this.health = health || 1;
    }
    get gtype() {
        return type[nameI];
    }
    move(name) {
        if (name == 'crazy') {
            this.position.y += this.speed + 0.5;
            this.position.x += 1.1*Math.sin(this.angle);
            this.angle += 0.07;
        }
        if (name == 'fat') {
            this.position.y += this.speed;
            this.position.x += 0;
        }
    }
}