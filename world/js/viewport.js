class Viewport {

    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas, zoom = 1, offset = null) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.zoom = zoom;
        this.center = new Point(canvas.width / 2, canvas.height / 2);
        this.offset = offset ? offset : scale(this.center, -1);

        this.drag = {
            start: new Point(0, 0),
            end: new Point(0, 0),
            offset: new Point(0, 0),
            active: false,
        }

        this.#addEventListeners();
    }

    reset() {
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.center.x, this.center.y);
        this.ctx.scale(1 / this.zoom, 1 / this.zoom);
        const offset = this.getOffset();
        this.ctx.translate(offset.x, offset.y);
    }

    /**
     * Get mouse
     * @param {MouseEvent} event
     * @param {boolean} [substractDragOffset=false]
     * @returns {Point}
     */
    getMouse(event, substractDragOffset = false) {
        const p = new Point(
            (event.offsetX - this.center.x) * this.zoom - this.offset.x,
            (event.offsetY - this.center.y) * this.zoom - this.offset.y,
        );

        return substractDragOffset ? substract(p, this.drag.offset) : p;
    }

    /**
     * Get offset
     * @returns {Point}
     */
    getOffset() {
        return add(this.offset, this.drag.offset);
    }

    #addEventListeners() {
        this.canvas.addEventListener('mousewheel', this.#handleMouseWheel.bind(this));
        this.canvas.addEventListener('mousedown', this.#handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.#handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.#handleMouseUp.bind(this));
    }

    /**
     * Handle mouse down
     * @param {MouseEvent} event
     */
    #handleMouseDown(event) {
        if (event.button === 1) {
            // Middle button
            this.drag.start = this.getMouse(event);
            this.drag.active = true;
        }
    }

    /**
     * Handle mouse move
     * @param {MouseEvent} event
     */
    #handleMouseMove(event) {
        if (this.drag.active) {
            this.drag.end = this.getMouse(event);
            this.drag.offset = substract(this.drag.end, this.drag.start);
        }
    }

    /**
     * Handle mouse up
     * @param {MouseEvent} event
     */
    #handleMouseUp(event) {
        if (this.drag.active) {
            this.offset = add(this.offset, this.drag.offset);
            this.drag = {
                start: new Point(0, 0),
                end: new Point(0, 0),
                offset: new Point(0, 0),
                active: false,
            }
        }
    }

    /**
     * Handle mouse wheel
     * @param {WheelEvent} event
     */
    #handleMouseWheel(event) {
        const direction = Math.sign(event.deltaY);
        const step = 0.1;
        this.zoom += direction * step;
        this.zoom = Math.max(1, Math.min(5, this.zoom));
    }
}