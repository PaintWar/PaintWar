class Animation {
    constructor(tracks) {
        this.tracks = tracks;
        this.duraton = 0;
        this.tracks.forEach(element => {
            this.duration = Math.max(this.duration, element.keyFrames[element.keyFrames.length - 1].time);
        });
    }

    apply(object, time) {
        this.tracks.forEach(track => {
            track.apply(object, time);
        });
    }

}