export class Animator {
    constructor(object) {
        this.object = object;
        this.animations = [];
    }

    play(animation, speed = 1.0) {
        this.animations.push({ animation, time: 0.0, speed });
    }
    remove(animation) {
        this.animations = this.animations.filter(anim => anim.animation !== animation);
    }

    update(deltaTime) {
        const stillRunning = [];
        for (let anim of this.animations) {
            anim.time += deltaTime * anim.speed;
            anim.animation.apply(this.object, anim.time);
            if (anim.animation.loop) {
                if (anim.time >= anim.animation.duration) {
                    anim.time %= anim.animation.duration;
                    anim.animation.tracks.forEach(track => track.lastTime = 0);
                }
                stillRunning.push(anim);
            }
            else if (anim.time < anim.animation.duration) {
                stillRunning.push(anim);
            }
        }
        this.animations = stillRunning;
    }
}