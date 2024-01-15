const networkCanvas = document.querySelector('#networkCanvas');

networkCanvas.width = 300;

const carCanvas = document.querySelector('#carCanvas');

carCanvas.width = 200;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);


let carAmount = 1;
let mutation = 0.1;
let cars = [];
let bestCar = cars[0];
let traffic = [];

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

    // Generate traffic on road
    traffic = [
        new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2),
        new Car(road.getLaneCenter(0), -300, 30, 50, 'DUMMY', 2),
        new Car(road.getLaneCenter(2), -300, 30, 50, 'DUMMY', 2),
        new Car(road.getLaneCenter(0), -500, 30, 50, 'DUMMY', 2),
        new Car(road.getLaneCenter(1), -500, 30, 50, 'DUMMY', 2),
        new Car(road.getLaneCenter(1), -700, 30, 50, 'DUMMY', 2),
        new Car(road.getLaneCenter(2), -700, 30, 50, 'DUMMY', 2),
        new Car(road.getLaneCenter(0), -900, 30, 50, 'DUMMY', 2),
        new Car(road.getLaneCenter(2), -900, 30, 50, 'DUMMY', 2),
        new Car(road.getLaneCenter(1), -1100, 30, 50, 'DUMMY', 2),
        new Car(road.getLaneCenter(2), -1100, 30, 50, 'DUMMY', 2),
    ]
}

init();


function animate() {
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find((c) => {
        return c.y === Math.min(...cars.map((c) => c.y))
    })

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, 'red');
    }

    carCtx.globalAlpha = 0.2;

    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, 'blue');
    }

    carCtx.globalAlpha = 1;

    bestCar.draw(carCtx, 'blue', true);


    carCtx.restore();

    // TODO: Draw vosualizer
    // Visualizer.drawNetwork(networkCtx, bestCar.brain);

    window.requestAnimationFrame(animate)
}

animate();

function generateCars(n) {
    const cars = [];

    for (let i = 0; i < n; i++) {
        cars.push(
            new Car(road.getLaneCenter(1), 100, 30, 50, 'AI')
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

    init();
}

function preloadBestBrain() {
    localStorage.setItem('bestBrain', `{"levels":[{"inputs":[0.625494795714112,0.27634310794530814,0,0,0],"outputs":[1,1,0,0,1,1],"biases":[-0.2553435821915144,0.06594998337508465,0.318278888134688,0.18035790990845912,-0.06352143736340277,-0.08580920948509274],"weights":[[-0.11831797059060994,0.2688951777011297,-0.467371951581465,-0.28319450501059096,-0.10418291065585915,0.17590058547942256],[-0.421249671767985,0.2683901209369257,0.24340072125660933,0.34442836314074915,0.06566446780807084,-0.1403376523099306],[-0.14016959405185386,-0.15402321629753032,0.09723780555351173,-0.3607631249272975,0.10799963320206721,0.07584864571693045],[-0.047925532257957246,0.5997186993813909,-0.25015581010751214,0.043469577909108,-0.4455399730773441,-0.15513709211050533],[0.15415490816110586,0.3940093139036827,0.3218987056818184,-0.394682497025169,0.16885280078630877,0.37510335058979244]]},{"inputs":[1,1,0,0,1,1],"outputs":[1,1,1,0],"biases":[-0.18295560252897858,0.010928207930708547,0.10668337077828877,-0.3156090184057366],"weights":[[-0.04790278050024707,0.25562033681147484,-0.32463531979305466,-0.32330077018662445],[0.2812939347768584,0.05440265693870972,0.2892020091771688,-0.35525415118302583],[0.1947940366554684,-0.2679874493382665,0.18566523287480347,0.3341308464505089],[-0.21181470285484963,-0.06639678535776583,-0.06649599656559937,-0.28103531951453375],[-0.24086957228270137,-0.23729417262469976,0.2074391152526007,0.023980548199800205],[-0.11215915422770559,0.1865908904293714,0.0006361838727819841,-0.0483950860325416]]}]}`
    );


    init();
}