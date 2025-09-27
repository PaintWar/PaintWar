/*
Animations usage guide:
 1. Create one or more Tracks (NumericTrack, SpriteTrack)
    NumericTrack: animates numeric properties over time (e.g. position, scale, rotation) (gradually interpolates the value).
    SpriteTrack: animates discrete sprite values over time (frames switch).
2. Combine Tracks into an Animation:
    const moveX = new NumericTrack("x", [
        { time: 0, value: 100 },
        { time: 2, value: 400 }
        ]);
    const animation = new Animation([moveX], true); // true = loop
    
    The string "x" here refers to the property of the object being animated.
       Examples:
        "x"         → object.x
        "rotation"  → object.rotation
        "scale.x"   → object.scale.x

3. Attach Animator to a object and play:
    const animator = new Animator(mySprite);
    animator.play(animation, 1.0); // optional speed multiplier
*/

export class Animator {
    constructor(object) {
        this.object = object;
        this.animations = [];
    }

    play(animation, speed = 1.0) {
        let anim = this.animations.find(a => a.animation === animation);
        if (anim) {
            anim.speed = speed;
            return;
        }

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
    
    setSpeed(animation, speed) {
        const anim = this.animations.find(a => a.animation === animation);
        if (anim) {
            anim.speed = speed;
        }
    }
}