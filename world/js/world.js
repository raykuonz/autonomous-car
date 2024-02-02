class World {

    /**
     * @param {Graph} graph
     * @param {number} [roadWidth=100]
     * @param {number} [roadRoundness=10]
     * @param {number} [buildingWidth=150]
     * @param {number} [buildingMinLength=150]
     * @param {number} [spacing=50]
     * @param {number} [treeSize=160]
     */
    constructor(
        graph,
        roadWidth = 100,
        roadRoundness = 10,
        buildingWidth = 150,
        buildingMinLength = 150,
        spacing = 50,
        treeSize = 160,
    ) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;
        this.buildingWidth = buildingWidth;
        this.buildingMinLength = buildingMinLength;
        this.spacing = spacing;
        this.treeSize = treeSize;

        this.envelopes = [];
        this.roadBorders = [];
        this.buildngs = [];
        this.trees = [];
        this.laneGuides = [];

        this.markings = [];

        this.frameCount = 0;

        this.cars = null;
        this.bestCar = null;

        this.generate();
    }

    static load(info) {
        // return new World(Graph.load(info.graph));
        const world = new World(new Graph());
        world.graph = Graph.load(info.graph);
        world.roadWidth = info.roadWidth;
        world.roadRoundness = info.roadRoundness;
        world.buildingWidth = info.buildingWidth;
        world.buildingMinLength = info.buildingMinLength;
        world.spacing = info.spacing;
        world.treeSize = info.treeSize;
        world.envelopes = info.envelopes.map((e) => Envelope.load(e));
        world.roadBorders = info.roadBorders.map((b) => new Segment(b.p1, b.p2));
        world.buildings = info.buildings.map((b) => Building.load(b));
        world.trees = info.trees.map((t) => new Tree(t.center, info.treeSize));
        world.laneGuides = info.laneGuides.map((g) => new Segment(g.p1, g.p2));

        world.markings = info.markings.map((m) => Marking.load(m));

        world.zoom = info.zoom;
        world.offset = info.offset;

        return world;
    }

    generate() {
        this.envelopes.length = 0;
        for (const segment of this.graph.segments) {
            this.envelopes.push(
                new Envelope(segment, this.roadWidth, this.roadRoundness)
            );
        }

        this.roadBorders = Polygon.union(this.envelopes.map((e) => e.poly));
        this.buildings = this.#generateBuildings();
        this.trees = this.#generateTrees();

        this.laneGuides.length = 0;
        this.laneGuides.push(...this.#generateLaneGuides());
    }


    #generateLaneGuides() {
        const tmpEnvelopes = [];

        for (const segment of this.graph.segments) {
            tmpEnvelopes.push(new Envelope(
                segment,
                this.roadWidth / 2,
                this.roadRoundness,
            ));
        }

        const segments = Polygon.union(tmpEnvelopes.map((e)=> e.poly));
        return segments;
    }

    #generateBuildings() {
        const tmpEnvelopes = [];

        for (const segment of this.graph.segments) {
            tmpEnvelopes.push(new Envelope(
                segment,
                this.roadWidth + this.buildingWidth + this.spacing * 2,
                this.roadRoundness,
            ));
        }

        const guides = Polygon.union(
            tmpEnvelopes.map((e) => e.poly)
        );

        for (let i = 0; i < guides.length; i++) {
            const segment = guides[i];

            if (segment.length() < this.buildingMinLength) {
                guides.splice(i, 1);
                i--;
            }

        }

        const supports = [];

        for (const segment of guides) {
            const length = segment.length() + this.spacing;
            const buildingCount = Math.floor(
                length / (this.buildingMinLength + this.spacing)
            );

            const buildingLength = length / buildingCount - this.spacing;

            const dir = segment.directionVector();

            let q1 = segment.p1;
            let q2 = add(q1, scale(dir, buildingLength));
            supports.push(new Segment(q1, q2));

            for (let i = 2; i <= buildingCount; i++) {
                q1 = add(q2, scale(dir, this.spacing));
                q2 = add(q1, scale(dir, buildingLength));
                supports.push(new Segment(q1, q2));
            }
        }

        const bases = [];
        for (const segment of supports) {
            bases.push(new Envelope(segment, this.buildingWidth).poly);
        }

        const eps = 0.001;

        for (let i = 0; i < bases.length - 1; i++) {
            for (let j = i + 1; j < bases.length; j++) {
                if (
                    bases[i].intersectsPoly(bases[j])
                    || bases[i].distanceToPoly(bases[j]) < this.spacing - eps
                ) {
                    bases.splice(j, 1);
                    j--;
                }
            }

        }

        return bases.map((b) => new  Building(b));
    }

    /**
     * Generate trees
     * @param {number} [count=10]
     * @returns {Point[]}
     */
    #generateTrees(count = 10) {
        const points = [
            ...this.roadBorders.map((s) => [s.p1, s.p2]).flat(),
            ...this.buildings.map((b) => b.base.points).flat(),
        ];

        const left = Math.min(...points.map((p) => p.x));
        const right = Math.max(...points.map((p) => p.x));
        const top = Math.min(...points.map((p) => p.y));
        const bottom = Math.max(...points.map((p) => p.y));

        const illegalPolys = [
            ...this.buildings.map((b) => b.base),
            ...this.envelopes.map((e) => e.poly),
        ]

        const trees = [];

        let tryCount = 0;

        while (tryCount < 100) {
            const p = new Point(
                lerp(left, right, Math.random()),
                lerp(bottom, top, Math.random()),
            )

            // Check if tree inside or nearby building / road
            let keep = true;
            for (const poly of illegalPolys) {
                if (poly.containsPoint(p) || poly.distanceToPoint(p) < this.treeSize / 2) {
                    keep = false;
                    break;
                }
            }

            // Check if tree too close to other trees
            if (keep) {
                for (const tree of trees) {
                    if (distance(tree.center, p) < this.treeSize) {
                        keep = false;
                        break;
                    }
                }
            }

            // Avoiding trees in the middle of nowhere
            if (keep) {
                let closeToSomething = false;
                for (const poly of illegalPolys) {
                    if (poly.distanceToPoint(p) < this.treeSize * 2) {
                        closeToSomething = true;
                        break;
                    }
                }
                keep = closeToSomething;
            }

            if (keep) {
                trees.push(new Tree(p, this.treeSize));
                tryCount = 0;
            }

            tryCount++;
        }
        return trees;
    }

    #getIntersections() {
        const subset = [];
        for (const point of this.graph.points) {
            let degree = 0;
            for (const segment of this.graph.segments) {
                if (segment.includes(point)) {
                    degree++;
                }
            }

            if (degree > 2) {
                subset.push(point);
            }
        }
        return subset;
    }

    #updateLights() {
        const lights = this.markings.filter((m) => m instanceof Light);

        const controlCenters = [];

        for (const light of lights) {

            const point = getNearestPoint(light.center, this.#getIntersections());

            let controlCenter = controlCenters.find((c) => c.equals(point));

            if (!controlCenter) {
                controlCenter = new Point(point.x, point.y);
                controlCenter.lights = [light];
                controlCenters.push(controlCenter);
            } else {
                controlCenter.lights.push(light);
            }
        }

        const greenDuration = 2;
        const yellowDuration = 1;

        for (const center of controlCenters) {
            center.ticks = center.lights.length * (greenDuration + yellowDuration);
        }

        const tick = Math.floor(this.frameCount / 60);
        for (const center of controlCenters) {
            const cTick = tick % center.ticks;
            const greenYellowIndex = Math.floor(cTick / (greenDuration + yellowDuration));
            const greenYellowState = cTick % (greenDuration + yellowDuration) < greenDuration ? 'green' : 'yellow';

            for (let i = 0; i < center.lights.length; i++) {
                if (i === greenYellowIndex)  {
                    center.lights[i].state = greenYellowState;
                } else {
                    center.lights[i].state = 'red';

                }
            }
        }

        this.frameCount++;
    }

    /**
     * Draw
     * @param {CanvasRenderingContext2D} context
     */
    draw(context, viewPoint, renderRadius = 1000) {

        this.#updateLights();
        for (const envelope of this.envelopes) {
            envelope.draw(context, { fill: '#BBB', stroke: '#BBB', lineWidth: 15 });
        }

        for (const marking of this.markings) {
            marking.draw(context);
        }

        for (const segment of this.graph.segments) {
            segment.draw(
                context,
                {
                    color: 'white',
                    width: 4,
                    dash: [10, 10],
                }
            );
        }

        context.globalAlpha = 0.2;
        for (const car of this.cars) {
            car.draw(context);
        }
        context.globalAlpha = 1;

        this.bestCar.draw(context, true);

        for (const segment of this.roadBorders) {
            segment.draw(context, { color: 'white', width: 4 })
        }

        const items = [ ...this.buildings, ...this.trees ]
            .filter((i) => i.base.distanceToPoint(viewPoint) < renderRadius);

        items.sort((a, b) => (
            b.base.distanceToPoint(viewPoint) -
            a.base.distanceToPoint(viewPoint)
        ));

        for (const item of items) {
            item.draw(context, viewPoint);
        }

        // for (const segment of this.laneGuides) {
        //     segment.draw(context, { color: 'red' })
        // }
    }
}