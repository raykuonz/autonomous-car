class Polygon {

    /**
     * @param {Point[]} points
     */
    constructor(points) {
        this.points = points;
        this.segments = [];
        for (let i = 1; i <= points.length; i++) {
            this.segments.push(
                new Segment(
                    points[i - 1],
                    points[i % points.length],
                )
            );
        }
    }

    static load(info) {
        return new Polygon(
            info.points.map((p) => new Point(p.x, p.y))
        );
    }

    /**
     * Union
     * @param {Polygon[]} polys
     * @returns {Segment[]}
     */
    static union(polys) {
        Polygon.multiBreak(polys);
        const keptSegments = [];

        for (let i = 0; i < polys.length; i++) {
            for (const segment of polys[i].segments) {
                let keep = true;

                for (let j = 0; j < polys.length; j++) {
                    if (i !== j) {
                        if (polys[j].containsSegment(segment)) {
                            keep = false;
                            break;
                        }
                    }

                }

                if (keep) {
                    keptSegments.push(segment);
                }
            }
        }

        return keptSegments;
    }

    /**
     * Multi break
     * @param {Polygon[]} polys
     */
    static multiBreak(polys) {
        for (let i = 0; i < polys.length - 1; i++) {
            for (let j = i + 1; j < polys.length; j++) {
                Polygon.break(polys[i], polys[j]);
            }
        }
    }

    /**
     * Break
     * @param {Polygon} poly1
     * @param {Polygon} poly2
     */
    static break(poly1, poly2) {
        const segs1 = poly1.segments;
        const segs2 = poly2.segments;

        for (let i = 0; i < segs1.length; i++) {
            for (let j = 0; j < segs2.length; j++) {

                const int = getIntersection(
                    segs1[i].p1,
                    segs1[i].p2,
                    segs2[j].p1,
                    segs2[j].p2,
                );

                if (int && int.offset !== 1 && int.offset !== 0) {
                    const point = new Point(int.x, int.y);
                    let aux = segs1[i].p2;
                    segs1[i].p2 = point;
                    segs1.splice(i + 1, 0, new Segment(point, aux));

                    aux = segs2[j].p2;
                    segs2[j].p2 = point;
                    segs2.splice(j + 1, 0, new Segment(point, aux));
                }
            }
        }
    }

    /**
     * Distance to point
     * @param {Point} point
     * @returns {number}
     */
    distanceToPoint(point) {
        return Math.min(...this.segments.map((s) => s.distanceToPoint(point)));
    }

    /**
     * Distance to poly
     * @param {Polygon} poly
     */
    distanceToPoly(poly) {
        return Math.min(...this.points.map((p) => poly.distanceToPoint(p)));
    }

    /**
     * Intersects poly
     * @param {Polygon} poly
     * @returns {boolean}
     */
    intersectsPoly(poly) {
        for (const s1 of this.segments) {
            for (const s2 of poly.segments) {
                if (getIntersection(s1.p1, s1.p2, s2.p1, s2.p2)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Contains segment
     * @param {Segment} segment
     */
    containsSegment(segment) {
        const midPoint = average(segment.p1, segment.p2);
        return this.containsPoint(midPoint);
    }

    /**
     * Contains point
     * @param {Point} point
     * @returns {boolean}
     */
    containsPoint(point) {
        const outerPoint = new Point(-1000, -1000);
        let intersectionCount = 0;
        for (const segment of this.segments) {
            const intersection = getIntersection(outerPoint, point, segment.p1, segment.p2);

            if (intersection) {
                intersectionCount++;
            }
        }

        return intersectionCount % 2 === 1;
    }

    /**
     * Draw segments
     * @param {CanvasRenderingContext2D} context
     */
    drawSegments(context) {
        for (const segment of this.segments) {
            segment.draw(context, { color: getRandomColor(), width: 5 });
        }
    }

    /**
     * Draw
     * @param {CanvasRenderingContext2D} context
     * @param {string} options.stroke
     * @param {number} options.lineWidth
     * @param {string} options.fill
     */
    draw(context, { stroke = 'blue', lineWidth = 2, fill = 'rgba(0,0,255,0.3)', join = 'miter' } = {}) {
        context.beginPath();
        context.fillStyle = fill;
        context.strokeStyle = stroke;
        context.lineWidth = lineWidth;
        context.lineJoin = join;
        context.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 0; i < this.points.length; i++) {
            context.lineTo(this.points[i].x, this.points[i].y);
        }
        context.closePath();
        context.fill();
        context.stroke();
    }
}