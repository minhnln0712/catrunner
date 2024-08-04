import { Actor } from "../Actor/Actor.js";

class Item extends Actor {
    constructor(canvas, width, height, xLocation, yLocation, moveSpeed) {
        super(canvas, width, height, xLocation, yLocation);
        this.bDisPlayCollision = false;
        this.moveSpeed = moveSpeed;
    }

    InitAnimation(buffItemSprite, spriteWidth, spriteHeight, spriteXDiff, spriteYDiff, imageWidth, imageHeight) {
        this.buffItemSprite = buffItemSprite;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.spriteXDiff = spriteXDiff;
        this.spriteYDiff = spriteYDiff;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
    }

    UpdateAnimation() {
        if (this.bDisPlayCollision)
            this.context.fillRect(this.xLocation, this.yLocation, this.width, this.height);
        this.context.drawImage(this.buffItemSprite,
            this.spriteWidth, this.animationIndex * this.spriteHeight,
            this.spriteWidth, this.spriteHeight,
            this.xLocation - this.spriteXDiff, this.yLocation - this.spriteYDiff,
            this.imageWidth, this.imageHeight);
    }
} 