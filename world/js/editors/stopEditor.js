class StopEditor extends MarkingEditor {

    /**
     * @param {Viewport} viewport
     * @param {World} world
     */
    constructor(viewport, world) {
        super(viewport, world, world.laneGuides);
    }

    createMarking(center, directionVector) {
        return new Stop(
            center,
            directionVector,
            this.world.roadWidth / 2,
            this.world.roadWidth / 2,
        )
    }
}
