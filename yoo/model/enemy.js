export class Enemy {
    constructor({position,size}, speed, nameI) {
        this.position = position;
        this.size = size;
        let type = ['fast','fat','crazy'];
        this.name = type[nameI];
        this.velocity = {
            x:speed,
            y:-speed
        }
    }
    get gtype() {
        return type[nameI];
    }
}