const networkCanvas = document.querySelector('#networkCanvas');

networkCanvas.width = 300;
networkCanvas.height = 300;

const miniMapCanvas = document.querySelector('#miniMapCanvas');

miniMapCanvas.width = 300;
miniMapCanvas.height = 300;

const carCanvas = document.querySelector('#carCanvas');

carCanvas.width = window.innerWidth;
carCanvas.height = window.innerHeight;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

let world = World.load(worldData);

const viewport = new Viewport(carCanvas, world.zoom, world.offset);
const miniMap = new MiniMap(miniMapCanvas, world.graph, 300);

let carAmount = 1;
let mutation = 0.1;
let cars = [];
let bestCar = cars[0];
let traffic = [];

const roadBorders = world.roadBorders
    .map((s) => [s.p1, s.p2]);

function init() {
    // Generate AI cars for training
    cars = generateCars(carAmount);

    // Get stored brain data if available
    if (localStorage.getItem('bestBrain')) {
        for (let i = 0; i < cars.length; i++) {
            cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));

            if (i !== 0) {
                NeuralNetwork.mutate(cars[i].brain, mutation);
            }
        }
    }
}

init();


function animate(time) {


    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(roadBorders, []);
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(roadBorders, traffic);
    }

    bestCar = cars.find((c) => {
        return c.fitness === Math.max(...cars.map((c) => c.fitness))
    })

    world.cars = cars;
    world.bestCar = bestCar;

    viewport.offset.x = -bestCar.x;
    viewport.offset.y = -bestCar.y;

    viewport.reset();
    const viewPoint = scale(viewport.getOffset(), -1);
    world.draw(carCtx, viewPoint);
    miniMap.update(viewPoint);

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, 'red');
    }

    networkCtx.lineDashOffset = -time / 50;
    networkCtx.clearRect(0, 0, networkCtx.canvas.width, networkCtx.canvas.height);
    Visualizer.drawNetwork(networkCtx, bestCar.brain);


    window.requestAnimationFrame(animate)
}

animate(0);

function generateCars(n) {

    const startPoints = world.markings.filter((m) => m instanceof Start);
    const startPoint = startPoints.length > 0
        ? startPoints[0].center
        : new Point(100, 100);
    const dir = startPoints.length > 0
        ? startPoints[0].directionVector
        : new Point(0, -1);
    const startAngle = -angle(dir) + Math.PI / 2;



    const cars = [];

    for (let i = 0; i < n; i++) {
        cars.push(
            new Car(startPoint.x, startPoint.y, 30, 50, startAngle, 'AI')
        );
    }

    return cars;
}

function save() {
    localStorage.setItem(
        'bestBrain',
        JSON.stringify(bestCar.brain)
    );
}

function discard() {
    localStorage.removeItem('bestBrain');
}

function restart() {
    carAmount = parseInt(document.querySelector('#carAmount').value);
    mutation = parseFloat(document.querySelector('#mutation').value);
    world = World.load(worldData);

    init();
}

function preloadBestBrain() {

    localStorage.setItem('bestBrain', '{"levels":[{"inputs":[0.4389975046870186,0,0,0.31852818187794874,0.6151224162814175],"outputs":[1,1,0,0,1,0],"biases":[-0.1941535160697035,-0.020861534516009146,0.34532283352122445,0.15184180663430755,-0.12487457195843883,0.05797034221232368],"weights":[[-0.06148880180415697,0.1149435351705453,0.0047273142577283905,-0.04154229032627785,0.05558995586542,-0.030510547232705],[-0.05987065325819504,-0.06590792972732964,0.4731360753573437,0.3853042173984066,0.014106398602607751,-0.014381786978981015],[0.08048965096255642,0.08085708199541654,0.21487385562430122,0.1632563893799632,-0.23857853256401018,0.13654406972301147],[-0.2765317839870864,0.1565723968432848,-0.10511259550332741,0.2602013201769538,-0.4983440379010301,0.1023725709688257],[0.08046295324803243,0.0019832613495091994,-0.07472635096648084,-0.020428906986922853,0.03261274487061189,-0.16621234652989955]]},{"inputs":[1,1,0,0,1,0],"outputs":[1,1,1,0],"biases":[0.09801895415342904,0.007061036709206145,-0.11722957588196728,-0.04365968018812491],"weights":[[0.21750483943793972,0.05766456245900299,-0.1774747887142878,-0.12011370360148535],[0.30592916890687466,0.10089300584072107,0.039192032578900804,-0.1975407137449875],[0.07034502102435909,-0.1634610086647917,0.14541468804481777,0.08612543140698234],[-0.23414939299548032,-0.3596249519736839,-0.07660191068436908,-0.24037488612664032],[-0.1672769201339535,0.04852940180588616,0.3274975076170971,0.0555046185587802],[-0.35236482305416933,0.3099193452351467,0.031043152803113885,0.028300478690623007]]}]}');
    init();
}