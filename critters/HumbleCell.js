class HumbleCell {

    constructor(_pos , _size) {

        this.type = 'humble';
        this.pos = _pos || createVector(random(width), random(height));
        this.size = _size || random(0.3, 0.5);
        this.width = 70 + this.size;
        this.height = 130 + this.size;
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);

        this.maxForce = HUMBLE_MAX_FORCE;
        this.maxSpeed = HUMBLE_MAX_SPEED / this.size;

        this.separationAmount = HUMBLE_SEPARATION_AMOUNT;
        this.killDist = Math.pow(VIRUS_KILL_DIST, 2);

        this.alphaColor = 20;
        this.fill = color(78, 88, 229);
        this.strokeCount = random(0, 100);
        this.bornColor = color(110, 118, 255);
        this.deadColor = color(random(80, 220), 0, random(10, 90));

        this.phase = random(0, 360);
        this.isInfected = false;
        this.isDead = false;

        this.foundPartner = false;
        this.partnerLoc = createVector(0, 0);
        this.partnerIndex = 0;
        this.isSpawner = false;
        this.givenBirth = false;
        this.birthCouter = 0;
        this.growthCounter = 0;
        this.health = 100;
    }

    render() {

        const thea = this.velocity.heading() + HALF_PI;

        // Aesthetic.
        this.alphaColor = map(this.health, 100, 0, 20, 0);
        this.fill.setAlpha(this.alphaColor);

        const strokeH = map(this.health, 100, 0, 0, 1);
        const strokeCol = lerpColor(this.bornColor, this.deadColor, strokeH);
        let strokeMod = map(Math.sin(this.strokeCount), -1, 1, 1, 3);
        this.strokeCount += 0.1;
        strokeWeight(strokeMod);

        stroke(strokeCol);
        fill(this.fill);

        const curveMod = map(Math.sin(this.phase), 0, 1, -0.3, 0.3);
        this.phase += 0.07 % 361;
        curveTightness(curveMod);

        push();
        translate(this.pos.x, this.pos.y);
        scale(this.size);
        rotate(thea);

        // Shape.
        beginShape();
        curveVertex(-15, 5);
        curveVertex(-37, -45);
        curveVertex(40, -45);
        curveVertex(40, 45);
        curveVertex(-40, 45);
        curveVertex(-37, -45);
        curveVertex(75, 5);
        endShape();

        pop();
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

    checkIsDead() {

        if (this.isDead) {
            humbleCells.splice(humbleCells.indexOf(this), 1);
        }
    }

    isOldEnough() {
        return this.size >= HUMBLE_CELL_AGE_OF_CONCEPTION;
    }

    applyBehaviour() {

        const range = new Rectangle(this.pos.x, this.pos.y, QUAD_TREE_DISTANCE); // Create a range for quad tree.
        const points = quadTree.query(range); // check quad tree with given range for other critters near by.
        const agentCalculations = gatherSurroundingAgentData(this, points, {separate: true});

        const otherCritters = agentCalculations.critters; // Other surrounding critters put into their own array.

        if (otherCritters.length > 0) {

            this.interactWithOthers(otherCritters);
        }

        if (points.length > 0) { // Only do something if critters found in quad tree.

            if (!this.foundPartner && this.isOldEnough()) { // Look for a partner to reproduce.
                this.searchForPartner(points);
            }

            if (this.foundPartner && !this.givenBirth) { // Cells can only reproduce once in their life span.
                this.mate(agentCalculations);
            }
        }

        // Give birth.
        if (this.birthCouter > HUMBLE_CELL_BIRTH_RATE) {

            this.giveBirth();
            this.birthCouter = 0;
        }

        // Die.
        if (this.size > HUMBLE_DEATH_SIZE) {

            this.maxSpeed = 0.3;
            this.wane();

            if (this.health < 100) {
                this.isDead = true;
            }
        }

        // Take damage.
        if (this.isInfected) {

            this.maxSpeed = 0.3;
            this.wane();

            if (this.health < 0) {
                this.isDead = true;
            }
        }

        if (this.birthCouter > 0) {
            separate(this, agentCalculations, 4);
        }
        else {

            wander(this, 0.1);
            separate(this, agentCalculations, 9);
        }

        this.grow();
    }

    fightBack(index) {

        // Reduce health of virus attacking.
        const deathRate = map(this.size, 0.1, 1.1, VIRUS_DEATH_RATE, 0.06);
        cells[index].health -= deathRate;

        if (cells[index].health < 0) {
            cells[index].isDead = true;
        }
    }

    interactWithOthers(otherCritters) {

        for (let i = 0; i < otherCritters.length; i++) {

            if (getCritterType(otherCritters[i]) === 'virus' && !this.size < HUMBLE_AGE_OF_ATTACK) {
                flee(this, otherCritters[i].data.pos, 3);
            }

            if (this.isInfected) {

                let attackerIndex = false;

                if (getCritterType(otherCritters[i]) !== 'passive') {
                    attackerIndex = getCritterIndex(cells, otherCritters[i]);
                }

                if (attackerIndex) {
                    this.fightBack(attackerIndex);
                }
            }
        }
    }

    mate(agentCalculations) {

        seekAndArrive(this, this.partnerLoc, 5);
        separate(this, agentCalculations, 1);
        this.birthCouter += 1;
    }

    wane() {

        wander(this, 0.9);
        this.health -= HUMBLE_RATE_OF_DEATH;
    }

    grow() {

        // Grows slightly over time.
        this.growthCounter += 1;

        if (this.growthCounter % 50 === 0) {
            this.size += HUMBLE_GROWTH_RATE;
        }
    }

    searchForPartner(points) {

        for (let i = 0; i < points.length; i++) {

            this.partnerIndex = getCritterIndex(humbleCells, points[i]) // Index of other partner.

            if (this.partnerIndex === humbleCells.indexOf(this) || this.partnerIndex === undefined) {
                continue;
            }

            const otherPos = createVector(humbleCells[this.partnerIndex].pos.x, humbleCells[this.partnerIndex].pos.y);
            const distance = distSquared(this.pos.x, this.pos.y, otherPos.x, otherPos.y);

            if ((distance < Math.pow(HUMBLE_MATING_DISTANCE, 2)) && (!humbleCells[this.partnerIndex].foundPartner)
                && humbleCells[this.partnerIndex].isOldEnough()) {

                // With the conditions met these two partners are going to stop searching for a partner and seek
                // each other.
                this.foundPartner = true;
                this.partnerLoc = otherPos;

                humbleCells[this.partnerIndex].foundPartner = true;
                humbleCells[this.partnerIndex].partnerLoc = this.pos;

                // The bigger cell is going to be the one to spawn a child.
                if (this.size > humbleCells[this.partnerIndex].size) {
                    this.isSpawner = true;
                }
                else {
                    humbleCells[this.partnerIndex].isSpawner = true;
                }
            }
        }
    }

    giveBirth() {

        if (this.isSpawner) {

            let numOfKids = Math.round(random(1, 3));

            for (let i = 0; i < numOfKids; i++) {

                if (humbleCells[this.partnerIndex] === undefined) { // Checks if same move on.
                    continue;
                }

                let childPos = p5.Vector.add(this.pos, createVector(random(-0.1, 0.1), random(-0.1, 0.1)));
                humbleCells.push(new HumbleCell(childPos, random(0.1, HUMBLE_BIRTH_SIZE)));
                humbleCells[this.partnerIndex].givenBirth = true;
            }
        }

        this.isSpawner = false;
        this.givenBirth = true;
    }
}