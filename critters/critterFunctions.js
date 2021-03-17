function getCritterIndex(array, critter) {

    /*
    We have access to the agent through the reference we of the object in the quad tree. But manipulating that
    data doesn't do anything to the actual cells we are rendering. This function just grabs the index of the
    cells we need to manipulate when needed.
     */

    for (let i = 0; i < array.length; i++) {

        if (array[i] === critter.data) {
            return i;
        }
    }
}

function getCritterType(critter) {

    return critter.data.type;
}

/**
 *
 * @param agent
 * @param otherAgent
 * @returns {boolean}
 */
function crittersAreSameTypeCheck(agent, otherAgent) {

    return agent.type === otherAgent.data.type;
}