export class Track {
    constructor(property, keyframes) {
        this.property = property;
        this.keyframes = keyframes;
        this.duration = keyframes.at(-1).time;
        this.lastTime = 0;
    }

    getValue(time){}

    apply(object, time) {
        const value = this.getValue(time);
        const parts = this.property.split(".");
        let target = object;
        for (let i = 0; i < parts.length - 1; i++) {
            target = target[parts[i]];
        }
        target[parts.at(-1)] = value;

        for (let frame of this.keyframes) {
            if (this.lastTime < frame.time && time >= frame.time && frame.callback) {
                frame.callback(object);
            }
        }
        this.lastTime = time;
    }
}