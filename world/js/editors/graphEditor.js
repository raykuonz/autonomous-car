/**
 * Graph editor
 * @property {HTMLCanvasElement} canvas
 * @property {CanvasRenderingContext2D} ctx
 */
class GraphEditor {

    /**
     * @param {Viewport} viewport
     * @param {Graph} graph
     */
    constructor(viewport, graph) {
        this.viewport = viewport
        this.canvas = viewport.canvas;
        this.graph = graph;
        this.ctx = this.canvas.getContext('2d');

        this.selected = null;
        this.dragging = false;
        this.mouse = null;
    }

    enable() {
        this.#addEventListeners();
    }

    disable() {
        this.#removeEventListeners();
        this.selected = null;
        this.hovered = null;
    }

    #addEventListeners() {
        this.boundMouseDown = this.#handleMouseDown.bind(this);
        this.boundMouseMove = this.#handleMouseMove.bind(this);
        this.boundMouseUp = () => this.dragging = false;
        this.boundContextMenu = (event) => event.preventDefault();

        this.canvas.addEventListener('mousedown', this.boundMouseDown);
        this.canvas.addEventListener('mousemove', this.boundMouseMove);
        this.canvas.addEventListener('mouseup', this.boundMouseUp);
        this.canvas.addEventListener('contextmenu', this.boundContextMenu);
    }

    #removeEventListeners() {
        this.canvas.removeEventListener('mousedown', this.boundMouseDown);
        this.canvas.removeEventListener('mousemove', this.boundMouseMove);
        this.canvas.removeEventListener('mouseup', this. boundMouseUp);
        this.canvas.removeEventListener('contextmenu', this.boundContextMenu);
    }

    /**
     * Handle mouse down
     * @param {MouseEvent} event
     */
    #handleMouseDown(event) {

        if (event.button === 2) {
            // right click
            if (this.selected) {
                this.selected = null;
            } else if (this.hovered) {
                this.#removePoint(this.hovered);
            }
        }

        if (event.button === 0) {
            // Left click
            if (this.hovered) {
                this.#selectPoint(this.hovered);
                this.dragging = true;
                return;
            }

            this.graph.addPoint(this.mouse);

            this.#selectPoint(this.mouse);
            this.hovered = this.mouse;
        }
    }

    /**
     * Handle mouse move
     * @param {MouseEvent} event
     */
    #handleMouseMove(event) {
        this.mouse = this.viewport.getMouse(event, true);
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewport.zoom);

        if (this.dragging) {
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }
    }

    /**
     * Select point
     * @param {Point} point
     */
    #selectPoint(point) {
        if (this.selected) {
            this.graph.tryAddSegment(
                new Segment(this.selected, point)
            );
        }

        this.selected = point;
    }

    /**
     * Remove point
     * @param {Point} point
     */
    #removePoint(point) {
        this.graph.removePoint(point);
        this.hovered = null;
        if (this.selected === point) {
            this.selected = null;
        }
    }

    dispose() {
        this.graph.dispose();
        this.selected = null;
        this.hovered = null;
    }

    display() {
        this.graph.draw(this.ctx);
        if (this.hovered) {
            this.hovered.draw(this.ctx, { fill: true });
        }
        if (this.selected) {
            const intent = this.hovered ? this.hovered : this.mouse;
            new Segment(this.selected, intent).draw(this.ctx, { dash: [3, 3]});
            this.selected.draw(this.ctx, { outline: true });
        }
    }
}