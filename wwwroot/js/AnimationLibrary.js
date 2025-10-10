import { Animation } from './Animation.js';
import { NumericTrack } from './NumericTrack.js';
import { SpriteTrack } from './SpriteTrack.js';

export class AnimationLibrary {
    static animations = {
        "Example": AnimationLibrary.createExampleAnimations()
    };

    static getAnimations(type) {
        return this.animations[type];
    }

    static createExampleAnimations() {
        return {
            "Idle": new Animation([
                new NumericTrack("scale.y", [
                    { time: 0, value: 1 },
                    { time: 0.2, value: 1.2 },
                    { time: 0.4, value: 1 }
                ])
            ], true),
            "Walk": new Animation([
                new NumericTrack("rotation", [
                    { time: 0, value: 0 },
                    { time: 2, value: Math.PI * 2 }
                ]) 
            ], true)
        };
    }

}