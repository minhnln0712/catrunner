import {Actor} from "../Actor/Actor.js"

export class Character extends Actor {
    constructor(canvas, width, height, xLocation, yLocation) {
        super(canvas, width, height, xLocation, yLocation);
        this.velocityX = 0;
        this.velocityY = 0;
        this.bEnableGravity = false;
        this.gravityValue = 0.02;
        this.gravitySpeed = 0;
        this.bIsOnTheGround = false;
        this.bBeginInteraction = false;
        this.animationIndex = 0;
        // TODO: Delete later
        this.HeightDiff = 0;
    }

    InitAnimation(characterSprite, spriteWidth, spriteHeight, spriteXDiff, spriteYDiff, imageWidth, imageHeight) {
        this.characterSprite = characterSprite;
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
        this.context.drawImage(this.characterSprite,
            spriteFrame * this.spriteWidth, this.animationIndex * this.spriteHeight,
            this.spriteWidth, this.spriteHeight,
            this.xLocation - this.spriteXDiff, this.yLocation - this.spriteYDiff,
            this.imageWidth, this.imageHeight);
    }

    UpdateNewPosition() {
        this.xLocation += this.velocityX;
        this.yLocation += this.velocityY;
    };

    MoveUp(value) {
        this.velocityY = -value;
    }

    MoveRight(value) {
        if (
            (this.xLocation <= 20 && value < 0) ||
            (this.xLocation >= this.canvas.width - this.width &&
                value > 0)
        ) {
            this.velocityX = 0;
        } else {
            this.velocityX = value;
        }
    }

    Jump(value) {
        this.gravityValue = -Math.abs(value);
    }

    GravityDown(value) {
        this.gravityValue = Math.abs(value);
    }

    StopMovement() {
        this.velocityX = 0;
        this.velocityY = 0;
    }

    ApplyGravity() {
        if (this.bEnableGravity) {
            this.gravitySpeed += this.gravityValue;
            this.yLocation += this.velocityY + this.gravitySpeed;
            this.bIsOnTheGround = false;
            let theGround = this.canvas.height - this.height - this.spriteYDiff - this.HeightDiff;
            this.CheckGround(theGround);
        }
    };

    CheckGround(groundYLocation) {
        if (this.yLocation >= groundYLocation) {
            this.yLocation = groundYLocation;
            this.gravitySpeed = 0;
            this.gravityValue = 0;
            this.bIsOnTheGround = true;
        }
    };

}