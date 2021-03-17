let boundingBox;
let quadTree;
let humbleCells = [];
let cells = [];
let passive = [];

function setup() {

    createCanvas(windowWidth, windowHeight);
    ellipseMode(CENTER);
    rectMode(CENTER);
    angleMode(DEGREES);

    createCritters();
    createTrigonometricLexicon(); // for optimization.
    createQuadTree();
}


function createQuadTree() {

    boundingBox = new Rectangle(width / 2, height / 2, width, height);
    quadTree = new QuadTree(boundingBox, 12);
}

function createCritters() {

    // Pushed critter objects into their respective arrays.

    for (let i = 0; i < NUM_OF_VIRUS; i++) {

        const pos = createVector(random(0, width), random(0, height));
        cells.push(new Virus(pos, true));
    }

    for (let i = 0; i < NUM_OF_HUMBLE_CELLS; i++) {

        humbleCells.push(new HumbleCell());
    }

    for (let i = 0; i < NUM_OF_PASSIVE_CELLS; i++) {

        passive.push(new PassiveCell());
    }
}

function insertCritterPosToQuadTree() {

    // Inserts the critter positions and subdivides the quad tree accordingly.

    for (let cell of cells) {

        const p = new Point(cell.pos.x, cell.pos.y, cell);
        quadTree.insert(p);
    }

    for (let cell of humbleCells) {

        const p = new Point(cell.pos.x, cell.pos.y, cell);
        quadTree.insert(p);
    }

    for (let cell of passive) {

        const p = new Point(cell.pos.x, cell.pos.y, cell);
        quadTree.insert(p);
    }
}