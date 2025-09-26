class Animator {
    constructor(object) {
        this.object = object;
        this.animation = null;
        this.speed = 1.0;
        this.time = 0;
        this.playing = false;
        this.loop = false;
    }

    play(animation, loop = false) {
        this.animation = animation;
        this.time = 0;
        this.playing = true;
        this.loop = loop;
    }

    update(deltaTime) {
        if (!this.playing || !this.animation)
            return;
        this.time +=deltaTime * this.speed;

        if (this.loop) {
            this.time %= this,animation.animation.duration;
        }
        else {
            this.time = Math.min(this.time, this.animation.dutation);
        }
        this.animation.apply(this.object, this.time);

    }
}