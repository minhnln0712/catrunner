import {Actor} from "../Actor/Actor.js"

export class BackgroundParallax extends Actor {
    constructor(canvas, width, height, xLocation, yLocation, image) {
        super(canvas, width, height, xLocation, yLocation);
        this.image = image;
    }

    Update() {
        this.context.drawImage(this.image, this.xLocation, this.yLocation, this.width, this.height);
        this.context.drawImage(this.image, this.xLocation + this.width, this.yLocation, this.width, this.height);
    }

    UpdateNewPosition(speedX, speedY) {
        this.xLocation -= speedX;
        this.yLocation += speedY;
        if (this.xLocation <= -(this.width)) {
            this.xLocation = 0;
        }
    };
}