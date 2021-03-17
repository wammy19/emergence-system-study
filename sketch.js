p5.disableFriendlyErrors = true; // For optimization.

function draw() {

    background(0, 110);
    insertCritterPosToQuadTree();
    drawVirusCells();
    drawPassive();
    drawHumbleCells();
    worldMod();

    quadTree.clear(); // Clear points from quad tree.
}

function drawVirusCells() {

    for (let cell of cells) {

        cell.applyBehaviour(quadTree);
        cell.borders();
        cell.update();
        cell.render();
        cell.checkIsDead();
    }
}

function drawHumbleCells() {

    for (let cell of humbleCells) {

        cell.applyBehaviour();
        cell.borders();
        cell.update();
        cell.render();
        cell.checkIsDead();
    }
}

function drawPassive() {

    for (let cell of passive) {

        cell.applyBehaviour();
        cell.borders();
        cell.update();
        cell.render();
    }
}

/*
READ ME.

Which assignment you've attempted?

- Autonomous Agents

What effect were you trying to achieve?

- From the start I wanted a lot of things on the screen all moving and breathing with every frame of animation.

- I wanted to achieve a balanced eco system, but with all the tweaking I do in the "constant.js", I can't seem to
  achieve a system that lasts. It's amazing how changing something very slightly can drastically change the outcome.
  John Holland talks about this phenomena in the reading you suggested "Emergence from order to chaos". Makes me
  wonder how finely balanced our exists must have to be.

- This final draw is interesting to me because I've added a passive cell (green) which doesn't do anything other
  than separate and attempt to group up with it's species. Just having 50 of these completely changes the out come of
  the system and they don't even interact with the other cells, they are passive.

How your code achieves this?

- I managed to achieve a lot of movement and species on the screen at once by implementing a quad tree. This allowed
  me to loop through only the necessary elements of an area rather than the entire global space. I did a number of
  smaller optimisations also.

- I didn't achieve a balanced system.

What are you happy with, what could be improved?

- I'm pleased that I was able to squeeze out so much performance out of JS.

- I'm pleased with the aesthetic.

- I'm glad a created a file of constants to tweak from the start.

- I wish I applied certain behaviours differently code wise. I found myself in a bit of a code muddle at times with
  grabbing and manipulating data. If i were to code this from the ground up again, I would go about it slightly
  differently. There was one day in particular were I just spent hours debugging and not actually seeing any visual
  results.

This was fun! (minus the low key existential crisis).
 */