class Building {
    /**
     * @param {Polygon} poly
     * @param {number} [height=200]
     */
    constructor(poly, height = 200) {
        this.base = poly;
        this.height = height;
    }

    static load(info) {
        return new Building(
            Polygon.load(info.base),
            info.height,
        );
    }

    /**
     * Draw
     * @param {CanvasRenderingContext2D} context
     * @param {Point} viewPoint
     */
    draw(context, viewPoint) {
        const topPoints = this.base.points.map((p) =>
            getFake3dPoint(p, viewPoint, this.height * 0.6)
        );

        const ceiling = new Polygon(topPoints);

        const sides = [];

        for (let i = 0; i < this.base.points.length; i++) {
            const nextI = (i + 1) % this.base.points.length;
            const poly = new Polygon([
                this.base.points[i],
                this.base.points[nextI],
                topPoints[nextI],
                topPoints[i],
            ])

            sides.push(poly);
        }

        sides.sort(
            (a, b) => {
                return b.distanceToPoint(viewPoint) -
                a.distanceToPoint(viewPoint);
            }
        )

        const baseMidPoints = [
            average(this.base.points[0], this.base.points[1]),
            average(this.base.points[2], this.base.points[3]),
        ];

        const topMidPoints = baseMidPoints.map((p) =>
            getFake3dPoint(p, viewPoint, this.height)
        );

        const roofPolys = [
            new Polygon([
                ceiling.points[0], ceiling.points[3],
                topMidPoints[1], topMidPoints[0]
            ]),
            new Polygon([
                ceiling.points[2], ceiling.points[1],
                topMidPoints[0], topMidPoints[1]
            ]),
        ]

        roofPolys.sort(
            (a, b) => {
                return b.distanceToPoint(viewPoint) -
                a.distanceToPoint(viewPoint);
            }
        )

        this.base.draw(context, { fill: 'white', stroke: 'rgba(0,0,0,0.2)', lineWidth: 20});

        for (const side of sides) {
            side.draw(context, { fill: 'white', stroke: '#AAA'})
        }

        ceiling.draw(context, { fill: 'white', stroke: 'white', lineWidth: 6 })

        for (const poly of roofPolys) {
            poly.draw(context, { fill: '#D44', stroke: '#C44', lineWidth: 8, join: 'round'})
        }
    }
}