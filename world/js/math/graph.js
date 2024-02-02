class Graph {

    /**
     * @param {Point[]} [points=[]]
     * @param {Segment[]} [segments=[]]
     */
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
    }

    /**
     * Load
     * @param {object} info
     * @returns {Graph}
     */
    static load(info) {
        const points = info.points.map((pointInfo) => new Point(pointInfo.x, pointInfo.y));
        const segments = info.segments.map((segmentInfo) => {
            return new Segment(
                points.find((p) => p.equals(segmentInfo.p1)),
                points.find((p) => p.equals(segmentInfo.p2)),
            )
        });
        return new Graph(points, segments);
    }

    /**
     * Hash
     * @returns {string}
     */
    hash() {
        return JSON.stringify(this);
    }

    /**
     * Add point
     * @param {Point} point
     */
    addPoint(point) {
        this.points.push(point);
    }

    /**
     * Try add point
     * @param {Point} point
     * @returns {boolean}
     */
    tryAddPoint(point) {
        if (!this.containsPoint(point)) {
            this.addPoint(point);
            return true;
        }

        return false;
    }

    /**
     * Remove point
     * @param {Point} point
     */
    removePoint(point) {
        const segments = this.getSegmentsWithPoint(point);
        for (const segment of segments) {
            this.removeSegment(segment);
        }
        this.points.splice(this.points.indexOf(point), 1);
    }

    /**
     * Get segments with point
     * @param {Point} point
     * @returns {Segment[]|[]}
     */
    getSegmentsWithPoint(point) {
        return this.segments.filter((s) => s.includes(point));
    }

    /**
     * add Segment
     * @param {Segment} segment
     */
    addSegment(segment) {
        this.segments.push(segment);
    }

    /**
     * Try add segment
     * @param {Segment} segment
     * @returns {boolean}
     */
    tryAddSegment(segment) {
        if (!this.containsSegment(segment) && !segment.p1.equals(segment.p2)) {
            this.addSegment(segment);
            return true;
        }

        return false;
    }

    /**
     * Remove segment
     * @param {Segment} segment
     */
    removeSegment(segment) {
        this.segments.splice(this.segments.indexOf(segment), 1);
    }

    /**
     * Contains points
     * @param {Point} point
     * @returns {Point|undefined}
     */
    containsPoint(point) {
        return this.points.find((p) => p.equals(point));
    }

    /**
     * Contains segment
     * @param {Segment} segment
     * @returns {Segment|undefined}
     */
    containsSegment(segment) {
        return this.segments.find((s) => s.equals(segment));
    }

    dispose() {
        this.points.length = 0;
        this.segments.length = 0;
    }

    /**
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
        for (const segment of this.segments) {
            segment.draw(context);
        }

        for (const point of this.points) {
            point.draw(context);
        }
    }
}