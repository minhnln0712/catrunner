import { Actor } from "../Actor/Actor.js";

export class Text extends Actor {
    constructor(canvas, height, width, xLocation, yLocation, color, font, fontSize) {
        super(canvas, height, width, xLocation, yLocation, color);
        this.font = font;
        this.fontSize = fontSize;
        this.textContent = "";
    }

    Update() {
        this.context.font = this.fontSize + " " + this.font;
        this.context.fillStyle = this.color;
        this.context.strokeStyle = 'black';
        this.context.fillText(this.textContent, this.xLocation, this.yLocation);
        this.context.strokeText(this.textContent, this.xLocation, this.yLocation);
    }
} 