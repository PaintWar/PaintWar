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
        this.animations = new Map();
        this.currentAnimation = null;
        this.currentTime = 0;
        this.currentSpeed = 1.0;
    }

    addAnimation(name, animation) {
        this.animations.set(name, animation);
    }

    play(name, speed = 1.0) {
        const animation = this.animations.get(name);
        if (!animation) {
            console.warn(`Animation '${name}' not found.`);
            return;
        }
        if (this.currentAnimation !== null) {
            this.currentAnimation.apply(this.object, this.currentAnimation.duration);
        }
        this.currentAnimation = animation;
        this.currentTime = 0;
        this.currentSpeed = speed;
    }

    update(deltaTime) {
        if (!this.currentAnimation) return;
        this.currentTime += deltaTime * this.currentSpeed;
        this.currentAnimation.apply(this.object, this.currentTime);

        if (this.currentAnimation.loop) {
            if (this.currentTime >= this.currentAnimation.duration) {
                this.currentTime %= this.currentAnimation.duration;
                this.currentAnimation.tracks.forEach(track => track.lastTime = 0);
            }
        }
        else if (this.currentTime >= this.currentAnimation.duration) {
            this.currentAnimation = null;
        }
    }
    
    setSpeed(speed) {
        this.currentSpeed = speed;
    }
}