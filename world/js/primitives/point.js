class Point {

    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Equals
     * @param {Point} point
     * @returns {boolean}
     */
    equals(point) {
        return this.x === point.x && this.y === point.y;
    }

    /**
     * Draw
     * @param {CanvasRenderingContext2D} context
     * @param {object} [options]
     * @param {number} [options.size=18]
     * @param {string} [options.color='black']
     * @param {boolean} [options.outline='false']
     * @param {boolean} [options.false='false']
     */
    draw(
        context,
        {
            size = 18,
            color = 'black',
            outline = false,
            fill = false,
        } = {},
    ) {
        const rad = size / 2;
        context.beginPath();
        context.fillStyle = color;
        context.arc(this.x, this.y, rad, 0, Math.PI * 2);
        context.fill();

        if (outline) {
            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = 'yellow';
            context.arc(this.x, this.y, rad * 0.6, 0, Math.PI * 2);
            context.stroke();
        }

        if (fill) {
            context.beginPath();
            context.arc(this.x, this.y, rad * 0.4, 0, Math.PI * 2);
            context.fillStyle = 'yellow';
            context.fill();
        }
    }
}