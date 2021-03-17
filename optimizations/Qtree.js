// This algorithm implementation is in some parts taken from the code train video on quad trees.
// I did try to implement it my self following the algorithm on wikipedia but referred to the video when I got too stuck.
// There are some differences to code train, I didn't include some functionality cause I didn't need it for my purpose.

class Point {

    // Keeps position of critters and a reference to the object.
    constructor(_x, _y, agent) {

        this.x = _x;
        this.y = _y;
        this.data = agent;
    }
}

class Rectangle {

    // This will be the bounding box with which the quad tree will get queried.

    constructor(_x, _y, _width, _height) {

        this.x = _x;
        this.y = _y;
        this.width = _width;
        this.height = _height || this.width;
    }

    contains(point) {

        return (point.x >= this.x - this.width &&
            point.x <= this.x + this.width &&
            point.y >= this.y - this.height &&
            point.y <= this.y + this.height
        );
    }


    intersects(range) {

        return !(range.x - range.w > this.x + this.width ||
            range.x + range.w < this.x - this.width ||
            range.y - range.h > this.y + this.height ||
            range.y + range.h < this.y - this.height
        );
    }
}

class QuadTree {

    constructor(_boundary, _capacity) {

        this.boundary = _boundary
        this.capacity = _capacity || 4;
        this.points = [];
        this.divided = false;
    }

    subDivide() {

        // Recursively add new quad tree objects if subdivision is needed. Sub division will happen if the current
        // quad tree has reached max capacity.

        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.width / 2;
        let h = this.boundary.height / 2;

        const northEast = new Rectangle(x + w, y - h, w, h);
        this.northEast = new QuadTree(northEast, this.capacity);

        const northWest = new Rectangle(x - w, y - h, w, h);
        this.northWest = new QuadTree(northWest, this.capacity);

        const southEast = new Rectangle(x + w, y + h, w, h);
        this.southEast = new QuadTree(southEast, this.capacity);

        const southWest = new Rectangle(x - w, y + h, w, h);
        this.southWest = new QuadTree(southWest, this.capacity);

        this.divided = true;
    }

    /**
     *
     * @param point
     * @returns {boolean | *}
     */
    insert(point) {

        if (!this.boundary.contains(point)) { // Don't do anything if the critter is already in the bounding box.
            return false;
        }

        if (this.points.length < this.capacity) { // if capacity hasn't been met, push into array.

            this.points.push(point);
            return true;
        }

        if (!this.divided) { // if capacity has been met, sub divide the current box.
            this.subDivide();
        }

        return (this.northEast. insert(point) || this.northWest.insert(point) ||
            this.southEast.insert(point) || this.southWest.insert(point)
        );
    }

    /**
     *
     * @param range
     * @param found
     * @returns {*[]}
     */
    query(range, found) {

        if (!found) { // Initially no critters will be found, so an empty array is created.
            found = [];
        }

        if (!range.intersects(this.boundary)) {
            return found;
        }

        for (let point of this.points) {

            if (range.contains(point)) {
                found.push(point);
            }
        }

        if (this.divided) {

            this.northEast.query(range, found);
            this.northWest.query(range, found);
            this.southEast.query(range, found);
            this.southWest.query(range, found);
        }

        return found;
    }

    clear() {

        // The positions need to be updated with each frame of animation. This resets the quad tree for that.
        this.points = [];
        this.divided = false;
    }
}