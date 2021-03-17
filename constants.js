// I think of this as the control panel. I've setup constants for me to play around with.
// It's amazing how changing one of these values slightly can have a totally different outcome.

const WANDER_RANDOM_MULTIPLIER = 1;
const QUAD_TREE_DISTANCE = 100; // Anything above 200 is pointless.

// Virus.
const VIRUS_SEPARATION = 20;
const VIRUS_COHESION_DISTANCE = 70;
const VIRUS_ALIGN_DISTANCE = 100;
const NUM_OF_VIRUS = 200;
const VIRUS_MAX_FORCE = 0.1; // Choose fractions
const VIRUS_MAX_SPEED = 2; // 2
const VIRUS_KILL_DIST = 150;
const VIRUS_DEATH_RATE = 0.2;
let VIRUS_BIRTH_PROBABILITY = 0.06;

// Humble Cell.
const HUMBLE_MAX_SPEED = 0.43;
const HUMBLE_MAX_FORCE = 0.1;
const NUM_OF_HUMBLE_CELLS = 80;
const HUMBLE_SEPARATION_AMOUNT = Math.pow(9, 2);
const HUMBLE_MATING_DISTANCE = 300;
const HUMBLE_CELL_AGE_OF_CONCEPTION = 0.2;
const HUMBLE_CELL_BIRTH_RATE = 120;
const HUMBLE_BIRTH_SIZE = 0.2;
const HUMBLE_GROWTH_RATE = 0.006;
const HUMBLE_DEATH_SIZE = 1.1;
const INFECT_DIST = 60;
const HUMBLE_RATE_OF_DEATH = 0.6;
const HUMBLE_AGE_OF_ATTACK = 0.6;

// Passive Cell.
const PASSIVE_SEPARATION_AMOUNT = 35;
const PASSIVE_COHESION_AMOUNT = 100;
const PASSIVE_ALIGN_AMOUNT = 70;
const PASSIVE_MAX_FORCE = 0.1;
const PASSIVE_MAX_SPEED = 5;
const NUM_OF_PASSIVE_CELLS = 60;

let freq = 0;
function worldMod() {

    /*
    Experimenting here. Putting the birth probability for the virus on a sine wave to mimic how a viruses prevalence
    seasonally.
     */

    VIRUS_BIRTH_PROBABILITY = map(Math.sin(freq), -1, 1, 0.05, 0.12);
    freq += 0.01;
}