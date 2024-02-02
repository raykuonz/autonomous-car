class Segment {

    /**
     * @param {Point} p1
     * @param {Point} p2
     */
    constructor(p1, p2, oneWay = false) {
        this.p1 = p1;
        this.p2 = p2;
        this.oneWay = oneWay;
    }

    /**
     * Equals
     * @param {Segment} segment
     * @returns {boolean}
     */
    equals(segment) {
        return this.includes(segment.p1) && this.includes(segment.p2);
    }

    /**
     * Includes
     * @param {Point} point
     * @returns {boolean}
     */
    includes(point) {
        return this.p1.equals(point) || this.p2.equals(point);
    }

    /**
     * Length
     * @returns {number}
     */
    length() {
        return distance(this.p1, this.p2);
    }

    /**
     * Direction vector
     * @returns {number}
     */
    directionVector() {
        return normalize(substract(this.p2, this.p1));
    }

    /**
     * Distance to point
     * @param {Point} point
     * @returns {number}
     */
    distanceToPoint(point) {
        const proj = this.projectPoint(point);
        if (proj.offset > 0 && proj.offset < 1) {
            return distance(point, proj.point);
        }
        const distToP1 = distance(point, this.p1);
        const distToP2 = distance(point, this.p2);
        return Math.min(distToP1, distToP2);
    }

    /**
     * Project point
     * @param {Point} point
     */
    projectPoint(point) {
        const a =substract(point, this.p1);
        const b =substract(this.p2, this.p1);
        const normB = normalize(b);
        const scaler = dot(a, normB);
        const proj = {
            point: add(this.p1, scale(normB, scaler)),
            offset: scaler / magnitude(b),
        };
        return proj;
    }


    /**
     * Draw
     * @param {CanvasRenderingContext2D} context
     * @param {number} [options.width=2]
     * @param {string} [options.color='black']
     * @param {number[]} [options.dash=[]]
     */
    draw(
        context,
        {
            width = 2,
            color = 'black',
            dash = [],
            cap = 'butt'
        } = {}
    ) {
        context.beginPath();
        context.lineWidth = width;
        context.strokeStyle = color;
        context.lineCap = cap;

        if (this.oneWay) {
            dash = [4, 4];
        }

        context.setLineDash(dash);
        context.moveTo(this.p1.x, this.p1.y);
        context.lineTo(this.p2.x, this.p2.y);
        context.stroke();
        context.setLineDash([]);
    }
}