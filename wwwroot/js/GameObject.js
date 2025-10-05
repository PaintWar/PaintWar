export class GameObject {
    constructor(id, sprite) {
        this.id = id;
        this.sprite = sprite;
        this.animator = new Animator(sprite);
    }

    playAnimation(name) {
        this.animator.playAnimation(name);
    }

    update(deltaTime) {
        this.animator.update(deltaTime);
    }
}