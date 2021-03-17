/**
 *
 * @param agent
 * @returns {*}
 */
function checkBounds(agent) {

    const padding = 15;

    if (agent.pos.x < padding) {

        let desired = createVector(agent.maxSpeed, agent.velocity.y);
        let steerForce = p5.Vector.sub(desired, agent.velocity);
        steerForce.mult(100);

        applyForce(agent, steerForce);
    }

    if (agent.pos.x > width - padding) {

        const desired = createVector(-agent.maxSpeed, agent.velocity.y);
        const steerForce = p5.Vector.sub(desired, agent.velocity);
        steerForce.mult(100);

        applyForce(agent, steerForce);
    }

    if (agent.pos.y < padding) {

        const desired = createVector(agent.velocity.x, agent.maxSpeed);
        const steerForce = p5.Vector.sub(desired, agent.velocity);
        steerForce.mult(100);

        applyForce(agent, steerForce);
    }

    if (agent.pos.y > height - padding) {

        const desired = createVector(agent.velocity.x, -agent.maxSpeed);
        const steerForce = p5.Vector.sub(desired, agent.velocity);
        steerForce.mult(100);

        applyForce(agent, steerForce);
    }

    return createVector(0, 0);
}