class Start extends Marking {

    /**
     * @param {Point} center
     * @param {number} directionVector
     * @param {number} width
     * @param {number} height
     */
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

        this.img = new Image();
        this.img.src = 'car.png';

        this.type = 'start';
    }

    /**
     * Draw
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
        context.save();
        context.translate(this.center.x, this.center.y);
        context.rotate(angle(this.directionVector) - Math.PI / 2);

        context.drawImage(
            this.img,
            -this.img.width / 2,
            -this.img.height / 2,
        );

        context.restore();
    }
}