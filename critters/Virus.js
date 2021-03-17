class Virus {

    constructor(_pos, _isAbleToDup) {

        this.type = 'virus';
        this.pos = _pos || createVector(random(width), random(height));
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.maxForce = VIRUS_MAX_FORCE;
        this.maxSpeed = VIRUS_MAX_SPEED;
        this.size = random(9, 12);
        this.health = 10;
        this.isDead = false;

        // For group behaviours.
        this.separationAmount = VIRUS_SEPARATION;
        this.cohesionDistance = VIRUS_COHESION_DISTANCE;
        this.alignDistance = VIRUS_ALIGN_DISTANCE;

        // Individual behaviour.
        this.isAbleToDup = _isAbleToDup || false;

        // Aesthetic.
        this.phase = random(0, 361); // sin wave used to modulate cell size.
        this.color = color(random(80, 220), 0, random(10, 90));
        this.alphaColor = 255;
    }

    update() {

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.pos.add(this.velocity);
        this.acceleration.mult(0);
    }

    render() {

        this.size = map(Math.sin(this.phase), 0, 1, 9, 12);
        this.phase += 0.2 % 361; // limit at 360.

        push();
        strokeWeight(this.size);

        this.alphaColor = map(this.health, 10, 0, 255, 90);
        this.color.setAlpha(this.alphaColor);

        stroke(this.color);
        translate(this.pos.x, this.pos.y);
        point(0, 0);
        pop();
    }

    borders() {

        if (this.pos.x < -50) this.pos.x = width + 20;
        if (this.pos.x > width + 50) this.pos.x = -20;
        if (this.pos.y < -50) this.pos.y = height + 20;
        if (this.pos.y > height + 50) this.pos.y = -20;
    }

    checkIsDead() {

        if (this.isDead) {

            cells.splice(cells.indexOf(this), 1);
        }
    }

    applyBehaviour(quadTree) {

        let range = new Rectangle(this.pos.x, this.pos.y, QUAD_TREE_DISTANCE); // Create a range for quad tree.
        let points = quadTree.query(range); // check quad tree with given range for other critters near by.
        let agentCalculations = gatherSurroundingAgentData(this, points, {separate: true, align: true,
            cohere: true});

        const otherCritters = agentCalculations.critters; // Array of all the other agents.

        if (otherCritters.length > 0) { // Only if other critters are near by, interact.
            this.interactWithOther(otherCritters);
        }

        if (points.length > 0) { // Only do something if agents are found in the quad tree.

            separate(this, agentCalculations, 9);
            align(this, agentCalculations, 3);
            cohere(this, agentCalculations, 5);
            wander(this, 0.7);
        }

        if (this.health < 0) {
            this.isDead = true;
        }
    }

    interactWithOther(critters) {

        for (let i = 0; i < critters.length; i++) { // Go through all the other critters near by.

            if (getCritterType(critters[i]) === 'humble') { // Interact with humble cells.

                const otherPos = critters[i].data.pos;
                const distance = distSquared(this.pos.x, this.pos.y, otherPos.x, otherPos.y); // Grab the dist.
                const index = getCritterIndex(humbleCells, critters[i]);

                // The virus will only attack if at a certain distance and if the humble cell is an old enough age.
                if (distance < critters[i].data.killDist && critters[i].data.size > HUMBLE_AGE_OF_ATTACK) {

                    seek(this, otherPos, 14);

                    if (distance < INFECT_DIST) { // When Virus is well in, infect.
                        humbleCells[index].isInfected = true;
                    }

                    if (this.isAbleToDup) { // Virus can reproduce while attack humble cells.

                        if (random() < VIRUS_BIRTH_PROBABILITY) {
                            cells.push(new Virus(p5.Vector.add(this.pos, createVector(1, 1)), false));
                        }
                    }
                }

                if (critters[i].data.size < HUMBLE_AGE_OF_ATTACK) {

                    flee(this, otherPos, 2);
                }
            }
        }
    }
}