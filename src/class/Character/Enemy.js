import { Actor } from "../Actor/Actor.js"

export class Enemy extends Actor {
    constructor(canvas, width, height, xLocation, yLocation, moveSpeed) {
        super(canvas, width, height, xLocation, yLocation)
        this.moveSpeed = moveSpeed;
        this.passCharacter = false;
    }

    InitAnimation(enemySprite, spriteWidth, spriteHeight, spriteXDiff, spriteYDiff, imageWidth, imageHeight) {
        this.enemySprite = enemySprite;
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
        this.context.drawImage(this.enemySprite,
            spriteFrame * this.spriteWidth, this.animationIndex * this.spriteHeight,
            this.spriteWidth, this.spriteHeight,
            this.xLocation - this.spriteXDiff, this.yLocation - this.spriteYDiff,
            this.imageWidth, this.imageHeight);
    }

    UpdateNewPosition(speedX, speedY) {
        this.xLocation -= speedX;
        this.yLocation += speedY;
    };

}