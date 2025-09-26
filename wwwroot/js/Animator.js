export class Animator {
    constructor(object) {
        this.object = object;
        this.animations = [];
    }

    play(animation, speed = 1.0) {
        this.animations.push({ animation, time: 0.0, speed });
    }

    update(deltaTime) {
        for (let anim of this.animations) {
            anim.time += deltaTime * anim.speed;
            anim.animation.apply(this.object, anim.time);
        }
    }
}