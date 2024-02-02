class TargetEditor extends MarkingEditor {

    /**
     * @param {Viewport} viewport
     * @param {World} world
     */
    constructor(viewport, world) {
        super(viewport, world, world.laneGuides);
    }

    createMarking(center, directionVector) {
        return new Target(
            center,
            directionVector,
            this.world.roadWidth / 2,
            this.world.roadWidth / 2,
        )
    }
}
