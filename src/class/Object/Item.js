import { Actor } from "../Actor/Actor.js";

export class Item extends Actor {
    constructor(canvas, width, height, xLocation, yLocation, moveSpeed) {
        super(canvas, width, height, xLocation, yLocation);
        this.bDisPlayCollision = false;
        this.moveSpeed = moveSpeed;
    }

    InitAnimation(itemSprite) {
        this.itemSprite = itemSprite;
    }

    UpdateAnimation() {
        if (this.bDisPlayCollision)
            this.context.fillRect(this.xLocation, this.yLocation, this.width, this.height);
        this.context.drawImage(this.itemSprite, this.xLocation, this.yLocation, this.width, this.height);
    }
} 