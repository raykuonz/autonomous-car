/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#myCanvas');

canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext('2d');

const worldString = localStorage.getItem('world');

const worldInfo = worldString ? JSON.parse(worldString) : null;

let world = worldInfo
    ? World.load(worldInfo)
    : new World(new Graph());

const graph = world.graph;

const viewport = new Viewport(canvas, world.zoom, world.offset);

const tools = {
    graph: {
        button: document.querySelector('#graphBtn'),
        editor: new GraphEditor(viewport, graph),
    },
    stop: {
        button: document.querySelector('#stopBtn'),
        editor: new StopEditor(viewport, world),
    },
    crossing: {
        button: document.querySelector('#crossingBtn'),
        editor: new CrossingEditor(viewport, world),
    },
    start: {
        button: document.querySelector('#startBtn'),
        editor: new StartEditor(viewport, world),
    },
    yield: {
        button: document.querySelector('#yieldBtn'),
        editor: new YieldEditor(viewport, world),
    },
    light: {
        button: document.querySelector('#lightBtn'),
        editor: new LightEditor(viewport, world),
    },
    parking: {
        button: document.querySelector('#parkingBtn'),
        editor: new ParkingEditor(viewport, world),
    },
    target: {
        button: document.querySelector('#targetBtn'),
        editor: new TargetEditor(viewport, world),
    },
}

let oldGraphHash = graph.hash();

setMode('graph');

animate();

function animate() {
    viewport.reset();

    if (graph.hash() !== oldGraphHash) {
        world.generate();
        oldGraphHash = graph.hash();
    }

    const viewPoint = scale(viewport.getOffset(), -1);
    world.draw(ctx, viewPoint);
    ctx.globalAlpha = 0.3;

    for (const tool of Object.values(tools)) {
        tool.editor.display();
    }

    requestAnimationFrame(animate);
}

function dispose() {
    tools.graph.editor.dispose();
    world.markings.length = 0;
}

function save() {

    world.zoom = viewport.zoom;
    world.offset = viewport.offset;

    const element = document.createElement('a');
    element.setAttribute(
        'href',
        'data:application/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(world))
    );

    const fileName = 'name.world';
    element.setAttribute('download', fileName);

    element.click();

    localStorage.setItem('world', JSON.stringify(world));
}

function load(event) {
    const file = event.target.files[0];
    if (!file) {
        alert('No file selected');
        return;
    }

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = (evt) => {
        const fileContent = evt.target.result;
        const jsonData = JSON.parse(fileContent);
        world = World.load(jsonData);
        localStorage.setItem('world', JSON.stringify(world));
        location.reload();
    }
}

function setMode(mode) {
    disableEditors();

    tools[mode].button.style.backgroundColor = 'white';
    tools[mode].button.style.filter = '';
    tools[mode].editor.enable();
}

function disableEditors() {
    for (const tool of Object.values(tools)) {
        tool.editor.disable();
        tool.button.style.backgroundColor = 'gray';
        tool.button.style.filter = 'grayscale(100%)';
    }
}

function openOsmPanel() {
    document.querySelector('#osmPanel').style.display = 'block';
}

function closeOsmPanel() {
    document.querySelector('#osmPanel').style.display = 'none';
}

function parseOsmData() {

    const osmDataContainer = document.querySelector('#osmDataContainer');

    if (osmDataContainer.value == '') {
        alert('Paste data first');
        return;
    }

    const res = Osm.parseRoads(JSON.parse(osmDataContainer.value));

    graph.points = res.points;
    graph.segments = res.segments;

    closeOsmPanel();
}