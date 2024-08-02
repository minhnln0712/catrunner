import { Actor } from "../Actor/Actor.js";
import { Character } from "../Character/Character.js";

export class Ground extends Actor {

    constructor(canvas, width, height, xLocation, yLocation, color, moveSpeed) {
        super(canvas, width, height, xLocation, yLocation, color);
        this.moveSpeed = moveSpeed;
    }

    CheckCollision(otherActor) {
        let touchCharacter = true;
        if (otherActor instanceof Character) {
            let actorLeft = this.xLocation;
            let actorRight = this.xLocation + this.width;
            let actorTop = this.yLocation;
            let actorBottom = this.yLocation + this.height;
            let otherActorLeft = otherActor.xLocation;
            let otherActorRight = otherActor.xLocation + otherActor.width;
            let otherActorTop = otherActor.yLocation;
            let otherActorBottom = otherActor.yLocation + otherActor.height;
            if (
                actorBottom < otherActorTop ||
                actorTop > otherActorBottom ||
                actorRight < otherActorLeft ||
                actorLeft > otherActorRight
            ) {
                touchCharacter = false;
            }
            if (touchCharacter && otherActor.gravitySpeed >= 0) {
                otherActor.CheckGround(this.yLocation - otherActor.height)
                return touchCharacter;
            }
        }
        return false;
    };
}