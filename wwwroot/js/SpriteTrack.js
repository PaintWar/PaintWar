import { Track } from "./Track.js";
export class SpriteTrack extends Track {
    getValue(time) {
        let current = this.keyframes[0];
        for (let i = 0; i < this.keyframes.length; i++) {
            if (time < this.keyframes[i].time)
                break;
            current = this.keyframes[i];
        }
        return current.value;
    }
}