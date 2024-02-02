class MarkingEditor {

    /**
     * @param {Viewport} viewport
     * @param {World} world
     */
    constructor(viewport, world, targetSegments) {
        this.viewport = viewport;
        this.world = world;

        this.canvas = viewport.canvas;
        this.ctx = this.canvas.getContext('2d');

        this.mouse = null;
        this.intent = null;

        this.targetSegments = targetSegments;

        this.markings = world.markings;
    }

    // To be overwritten
    createMarking(center, directionVector) {
        return center;
    }

    enable() {
        this.#addEventListeners();
    }

    disable() {
        this.#removeEventListeners();
    }

    #addEventListeners() {
        this.boundMouseDown = this.#handleMouseDown.bind(this);
        this.boundMouseMove = this.#handleMouseMove.bind(this);
        this.boundContextMenu = (event) => event.preventDefault();

        this.canvas.addEventListener('mousedown', this.boundMouseDown);
        this.canvas.addEventListener('mousemove', this.boundMouseMove);
        this.canvas.addEventListener('contextmenu', this.boundContextMenu);
    }

    #removeEventListeners() {
        this.canvas.removeEventListener('mousedown', this.boundMouseDown);
        this.canvas.removeEventListener('mousemove', this.boundMouseMove);
        this.canvas.removeEventListener('contextmenu', this.boundContextMenu);
    }

    /**
     * Handle mouse move
     * @param {MouseEvent} event
     */
    #handleMouseMove(event) {
        this.mouse = this.viewport.getMouse(event, true);
        const segment = getNearestSegment(
            this.mouse,
            this.targetSegments,
            10 * this.viewport.zoom
        );

        if (segment) {
            const proj = segment.projectPoint(this.mouse);
            if (proj.offset >= 0 && proj.offset <= 1) {
                this.intent = this.createMarking(
                    proj.point,
                    segment.directionVector(),
                );
            } else {
                this.intent = null;
            }
        } else {
            this.intent = null;
        }
    }

    /**
     * Handle mouse down
     * @param {MouseEvent} event
     */
    #handleMouseDown(event) {
        if (event.button === 0) {
            // Left click
            if (this.intent) {
                this.markings.push(this.intent);
                this.intent = null;
            }
        }

        if (event.button === 2) {
            // Right click
            for (let i = 0; i < this.markings.length; i++) {
                const poly = this.markings[i].poly;
                if (poly.containsPoint(this.mouse)) {
                    this.markings.splice(i, 1);
                    return;
                }
            }
        }
    }

    display() {
        if (this.intent) {
            this.intent.draw(this.ctx);
        }
    }
}
