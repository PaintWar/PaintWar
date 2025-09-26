export class Track {
    constructor(property, keyframes) {
        this.property = property;
        this.keyframes = keyframes;
        this.duration = keyframes.at(-1).time;
    }

    getValue(){}

    apply(object, time) {
        const value = this.getValue(time);
        const parts = this.property.split(".");
        let target = object;
        for (let i = 0; i < parts.length - 1; i++) {
            target = target[parts[i]];
        }
        target[parts.at(-1)] = value;
    }
}