class PassiveCell {

    constructor() {

        this.type = 'passive';
        this.pos = createVector(random(width), random(height));
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.maxForce = PASSIVE_MAX_FORCE;
        this.maxSpeed = PASSIVE_MAX_SPEED;
        this.color = color(9, random(60, 120), random(60, 110), 200);
        this.phase = random(0, 100);

        this.separationAmount = PASSIVE_SEPARATION_AMOUNT;
        this.cohesionDistance = PASSIVE_COHESION_AMOUNT;
        this.alignDistance = PASSIVE_ALIGN_AMOUNT;

    }

    borders() {

        if (this.pos.x < -50) this.pos.x = width + 20;
        if (this.pos.x > width + 50) this.pos.x = -20;
        if (this.pos.y < -50) this.pos.y = height + 20;
        if (this.pos.y > height + 50) this.pos.y = -20;
    }

    update() {

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.pos.add(this.velocity);
        this.acceleration.mult(0);
    }

    render() {

        this.size = map(Math.sin(this.phase), -1, 1, 8, 14);
        this.phase += 0.5;

        push();
        strokeWeight(this.size);
        stroke(this.color);
        translate(this.pos.x, this.pos.y);
        point(0, 0);
        pop();
    }

    applyBehaviour() {

        let range = new Rectangle(this.pos.x, this.pos.y, QUAD_TREE_DISTANCE); // Create a range for quad tree.
        let points = quadTree.query(range); // check quad tree with given range for other critters near by.
        let agentCalculations = gatherSurroundingAgentData(this, points, {separate: true, align: true,
            cohere: true}, true);

        if (points.length > 0) { // Only do something if agents are found in the quad tree.

            separate(this, agentCalculations, 9);
            align(this, agentCalculations, 8);
            cohere(this, agentCalculations, 8);
            wander(this, 0.5);
        }
    }
}