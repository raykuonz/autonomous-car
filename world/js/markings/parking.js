class Parking extends Marking {

    /**
     * @param {Point} center
     * @param {number} directionVector
     * @param {number} width
     * @param {number} height
     */
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

        this.borders = [
            this.poly.segments[0],
            this.poly.segments[2],
        ];

        this.type = 'parking';
    }

    /**
     * Draw
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
        // this.poly.draw(context);
        for (const border of this.borders) {
            border.draw(context, { width: 5, color: 'white' });
        }

        context.save();
        context.translate(this.center.x, this.center.y);
        context.rotate(angle(this.directionVector));

        context.beginPath();
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.fillStyle = 'white';
        context.font ='bold ' + this.height * 0.9 + 'px Arial';
        context.fillText('P', 0, 3);

        context.restore();
    }
}