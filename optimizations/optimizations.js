let sinList = [];
let cosList = [];

function createTrigonometricLexicon() {

    // A lexicon of the values sin(0 to 360) and cos(0 to 360) is created.
    // This is to avoid computing this while in the loop for optimizations sake.
    for (let i = 0; i < 361; i++) {

        sinList.push(Math.sin(i)); // https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance
        cosList.push(Math.cos(i)); // it is suggested in the link above to use certain JS math functions over p5 ones.
    }
}

/**
 *
 * @param agent
 * @param agentsArray
 * @param options
 * @param gatherAllData
 * @returns {{cohesionCounter: number, alignCounter: number, posDiffSum: *, posSum: *, velocitySum: *, separationCounter: number}}
 */
function gatherSurroundingAgentData(agent, agentsArray, options, gatherAllData) { // options {separate: bool, cohere: bool,
    // align: bool}

    /**
     * All these calculations could be done in their own for loops in their respective functions, but that would greatly
     * increase the amount of iterations needed. This is a syntactic sacrifice.
     */

    // Dist squared is used later on because there is no need to use the square root operation,
    const separationAmount = Math.pow(agent.separationAmount, 2);
    const neighborDistance = Math.pow(agent.alignDistance, 2);
    const cohesionDistance = Math.pow(agent.cohesionDistance, 2);

    let posDiffSum = createVector(0, 0);
    let posSum = createVector(0, 0);
    let velocitySum = createVector(0, 0);

    let separationCounter = 0;
    let cohesionCounter = 0;
    let alignCounter = 0;

    let critters = [];

    for (let i = 0; i < agentsArray.length; i++) {

       if (!crittersAreSameTypeCheck(agent, agentsArray[i])) {
           critters.push(agentsArray[i]);

           if (!gatherAllData) {
               continue; // Don't gather calculations if critters aren't the same type.
           }
       }

        const otherAgentPos = createVector(agentsArray[i].data.pos.x, agentsArray[i].data.pos.y);
        const distance = distSquared(agent.pos.x, agent.pos.y, otherAgentPos.x, otherAgentPos.y);

        // Separation Calculation.
        if ((options.separate) && (distance > 0) &&
            (distance < Math.pow(agent.size / 2 + agentsArray[i].data.size / 2, 2) + separationAmount)) {

            const difference = p5.Vector.sub(agent.pos, otherAgentPos);
            difference.normalize();
            difference.div(distance);

            posDiffSum.add(difference);
            separationCounter++;
        }

        // // Cohesion Calculation.
        if (options.c && distance > 0 &&
            distance < cohesionDistance * 2) {

            posSum.add(otherAgentPos);
            cohesionCounter++;
        }

        // Align Calculation.
        if (options.align && distance > 0 &&
            distance < neighborDistance * 2) {

            velocitySum.add(agentsArray[i].velocity);
            alignCounter++;
        }

    }

    return {
        posDiffSum: posDiffSum,
        posSum: posSum,
        velocitySum: velocitySum,
        separationCounter: separationCounter,
        cohesionCounter: cohesionCounter,
        alignCounter: alignCounter,
        critters: critters,
    }
}

/**
 *
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {number}
 */
function distSquared(x1, y1, x2, y2) {

    // https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance
    // Distance squared was recommended to avoid using square root operation with normal euclidean distance.

    let dx = x2 - x1;
    let dy = y2 - y1;
    return dx * dx + dy * dy;
}