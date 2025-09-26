export class Animation {
    constructor(tracks, loop = false) {
        this.tracks = tracks;
        this.duration = 0;
        this.loop = loop;
        this.tracks.forEach(element => {
            this.duration = Math.max(this.duration, element.keyframes[element.keyframes.length - 1].time);
        });
    }

    apply(object, time) {
        if (this.loop) {
            time %= this.duration;
        }
        this.tracks.forEach(track => {
            track.apply(object, time);
        });
    }

}