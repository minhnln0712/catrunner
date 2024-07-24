export class Actor {
    constructor(canvas, width, height, xLocation, yLocation, color) {
        this.canvas = canvas
        this.context = this.canvas.getContext("2d");
        this.width = width;
        this.height = height;
        this.color = color;
        this.xLocation = xLocation;
        this.yLocation = yLocation;
        this.bBeginInteraction = false;
        this.bDisPlayCollision = true;
    }

    Update() {
        if (this.bDisPlayCollision) {
            this.context.fillStyle = this.color;
            this.context.fillRect(this.xLocation, this.yLocation, this.width, this.height);
        }
    }

    CheckCollision(otherActor) {
        this.bBeginInteraction = true;
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
            this.bBeginInteraction = false;
        }
        return this.bBeginInteraction;
    };
}