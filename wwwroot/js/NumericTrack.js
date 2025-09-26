class NumericTrack extends Track {
    getValue(time) {
        let prevFrame = this.keyframes[0];
        let nextFrame = this.keyframes[this.keyframes.length - 1];

        for (let i = 0; i < this.keyframes.length - 1; i++) {
            if (time >= this.keyframes[i].time && time <= this.keyframes[i + 1].time) {
                prevFrame = this.keyframes[i];
                nextFrame = this.keyframes[i + 1];
                break;
            }
        }
        const progress = (time - prevFrame.time) / (nextFrame.time - prevFrame.time);
        return prevFrame.value + (nextFrame.value - prevFrame.value) * progress;
    }
}