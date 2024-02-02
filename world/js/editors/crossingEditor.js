class CrossingEditor extends MarkingEditor {

    /**
     * @param {Viewport} viewport
     * @param {World} world
     */
    constructor(viewport, world) {
        super(viewport, world, world.graph.segments);
    }

    createMarking(center, directionVector) {
        return new Crossing(
            center,
            directionVector,
            this.world.roadWidth,
            this.world.roadWidth / 2,
        )
    }
}
