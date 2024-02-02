class Light extends Marking {

    /**
     * @param {Point} center
     * @param {number} directionVector
     * @param {number} width
     * @param {number} height
     */
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, 18);

        this.state = 'red';

        this.border = this.poly.segments[0];

        this.type = 'light';
    }

    /**
     * Draw
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
        const perp = perpendicular(this.directionVector);

        const line = new Segment(
            add(this.center, scale(perp, this.width / 2)),
            add(this.center, scale(perp, -this.width / 2)),
        );

        const green = lerp2D(line.p1, line.p2, 0.2);
        const yellow = lerp2D(line.p1, line.p2, 0.5);
        const red = lerp2D(line.p1, line.p2, 0.8);

        new Segment(red, green).draw(context, {
            width: this.height,
            cap: 'round',
        });

        green.draw(context, {
            size: this.height * 0.6,
            color: '#060',
        });
        yellow.draw(context, {
            size: this.height * 0.6,
            color: '#660',
        });
        red.draw(context, {
            size: this.height * 0.6,
            color: '#600',
        });

        switch (this.state) {
            case 'green':
                green.draw(context, {
                    size: this.height * 0.6,
                    color: '#0F0',
                });
                break;
            case 'yellow':
                yellow.draw(context, {
                    size: this.height * 0.6,
                    color: '#FF0',
                });
                break;
            case 'red':
                red.draw(context, {
                    size: this.height * 0.6,
                    color: '#F00',
                });
                break;
        }
    }
}