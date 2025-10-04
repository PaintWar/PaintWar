export class Animation {
    constructor(name, tracks, loop = false) {
        this.name = name;
        this.tracks = tracks;
        this.duration = 0;
        this.loop = loop;
        this.tracks.forEach(element => {
            this.duration = Math.max(this.duration, element.keyframes[element.keyframes.length - 1].time);
        });
    }

    apply(object, time) {
        this.tracks.forEach(track => {
            track.apply(object, time);
        });
    }

}