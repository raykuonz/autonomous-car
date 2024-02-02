class Crossing extends Marking {

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

        this.type = 'crossing';
    }

    /**
     * Draw
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
        // this.poly.draw(context);

        const perp = perpendicular(this.directionVector);

        const line = new Segment(
            add(this.center, scale(perp, this.width / 2)),
            add(this.center, scale(perp, -this.width / 2)),
        );

        line.draw(context, {
            width: this.height,
            color: 'white',
            dash: [11, 11],
        });

        // for (const border of this.borders) {
        //     border.draw(context);
        // }
    }
}