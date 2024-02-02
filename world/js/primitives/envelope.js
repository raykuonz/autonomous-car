class Envelope {

    /**
     * @param {Segment} skeleton
     * @param {number} width
     * @param {number} [roundness=1]
     */
    constructor(skeleton, width, roundness = 1) {
        if (skeleton) {
            this.skeleton = skeleton;
            this.poly = this.#generatePolygon(width, roundness);
        }
    }

    static load(info) {
        const env = new Envelope();
        env.skeleton = new Segment(info.skeleton.p1, info.skeleton.p2);
        env.poly = Polygon.load(info.poly);
        return env;
    }

    /**
     * Generate polygon
     * @param {number} width
     * @param {number} roundness
     * @returns {Polygon}
     */
    #generatePolygon(width, roundness) {
        const { p1, p2 } = this.skeleton;

        const radius = width / 2;
        const alpha = angle(substract(p1, p2))

        const alphaCw = alpha + Math.PI / 2;
        const alphaCcw = alpha - Math.PI / 2;

        const points = [];
        const step = Math.PI / Math.max(1, roundness);
        const eps = step / 2;
        for (let i = alphaCcw; i <= alphaCw + eps; i += step) {
            points.push(translate(p1, i, radius));
        }
        for (let i = alphaCcw; i <= alphaCw + eps; i += step) {
            points.push(translate(p2, Math.PI + i, radius));
        }

        return new Polygon(points);
    }

    /**
     * Draw
     * @param {CanvasRenderingContext2D} context
     */
    draw(context, options) {
        this.poly.draw(context, options);
        // this.poly.drawSegments(context);
    }
}