export class Sound {
    constructor(src, bLoop) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", 'none');
        this.sound.loop = bLoop;
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    Play() {
        this.sound.play().then(r => {
            console.log("Sound played!")
        });
    }

    Stop() {
        this.sound.pause();
    }
}