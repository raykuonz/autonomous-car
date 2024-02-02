class Target extends Marking {

    /**
     * @param {Point} center
     * @param {number} directionVector
     * @param {number} width
     * @param {number} height
     */
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

        this.type = 'target';
    }

    /**
     * Draw
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
        this.center.draw(context, {
            color: 'red',
            size: 30,
        });
        this.center.draw(context, {
            color: 'white',
            size: 20,
        });
        this.center.draw(context, {
            color: 'red',
            size: 10,
        });
    }
}