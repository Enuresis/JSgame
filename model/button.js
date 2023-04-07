import {canvas} from "../view/renderer.js";

export class Button{
    constructor({position,dimentions},name) {
        this.position = position;
        this.dimentions = dimentions;
        this.name = name;
        this.index = 0;
    }
}