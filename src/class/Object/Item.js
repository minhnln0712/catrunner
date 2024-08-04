import {Actor} from "../Actor/Actor.js";

class BuffItem extends Actor {
    constructor(canvas, width, height, xLocation, yLocation) {
        super(canvas, width, height, xLocation, yLocation);
        this.bDisPlayCollision = false;
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

    UpdateAnimation(gameFrame, staggerFrames, TotalFrames) {
        if (this.bDisPlayCollision)
            this.context.fillRect(this.xLocation, this.yLocation, this.width, this.height);
        const spriteFrame = Math.floor(gameFrame / staggerFrames) % TotalFrames;
        this.context.drawImage(this.buffItemSprite,
            spriteFrame * this.spriteWidth, this.animationIndex * this.spriteHeight,
            this.spriteWidth, this.spriteHeight,
            this.xLocation - this.spriteXDiff, this.yLocation - this.spriteYDiff,
            this.imageWidth, this.imageHeight);
    }
} 