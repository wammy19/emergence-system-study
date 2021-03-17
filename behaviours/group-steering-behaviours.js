function separate(agent, calculations, _multiplier = 1) {

    const sum = calculations.posDiffSum;
    const counter = calculations.separationCounter;

    if (counter > 0) {

        sum.div(counter);
        sum.setMag(agent.maxSpeed);
        sum.sub(agent.velocity);
        sum.limit(agent.maxForce);
        sum.mult(_multiplier);

        applyForce(agent, sum);
    }
}

function align(agent, calculations, _multiplier = 1) {

    const sum = calculations.velocitySum;
    const count = calculations.alignCounter;

    if (count > 0) {

        sum.div(count);
        sum.normalize();
        sum.mult(agent.maxSpeed);
        sum.sub(agent.velocity);
        sum.limit(agent.maxForce);
        sum.mult(_multiplier);

        applyForce(agent, sum);
    }
}

function cohere(agent, calculations, _multiplier = 1) {

    const sum =  calculations.posSum;
    const counter = calculations.cohesionCounter;

    if (counter > 0) {
        sum.div(counter);
        seek(agent, sum, _multiplier);
    }
}