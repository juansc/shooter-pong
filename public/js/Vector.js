let UnsupportedOperationError = {
    name: "Invalid Arguments Exception",
    message: "Unable to perform operation on given vector"
}

let VectorDimensionError = {
    name: "Invalid Arguments Exception",
    message: "Vectors dimensions do not match"
}

class Vector {
	constructor(elements) {
        this.elements = elements;
        this.dim = elements.length;
    }

    clone() {
        return new Vector(this.elements.slice());
    }

    add(vector) {
        if(this.dim !== vector.dim) {
            throw VectorDimensionError;
        }
        for(var i = 0; i < this.dim; i++) {
            this.elements[i] += vector.elements[i];
        }
    }

    plus(vector) {
        var new_vect = this.clone();
        new_vect.add(vector);
        return new_vect;
    }

    scale(factor) {
        for (var i = 0; i < this.dim; i++) {
            this.elements[i] *= factor;
        }
    }

    times(factor) {
        var new_vect = this.clone();
        new_vect.scale(factor);
        return new_vect;
    }

    subtract(vector) {
        if(this.dim !== vector.dim) {
            throw VectorDimensionError;
        }

        for(var i = 0; i < this.dim; i++) {
            this.elements[i] -= vector.elements[i];
        }
    }

    minus(vector) {
        var new_vect = this.clone();
        new_vect.subtract(vector);
        return new_vect;
    }

    get magnitude() {
        var magnitude = 0;
        for (var i = 0; i < this.dim; i++) {
            magnitude += this.elements[i]*this.elements[i];
        }
        return Math.sqrt(magnitude);
    }

    get x() {
        if(this.dim < 1) {
            throw UnsupportedOperationError;
        }
        return this.elements[0];
    }

    get y() {
        if(this.dim < 2) {
            throw UnsupportedOperationError;
        }
        return this.elements[1];
    }

    get z() {
        if(this.dim < 3) {
            throw UnsupportedOperationError;
        }
        return this.elements[2];
    }

    distance(vector) {
        return this.minus(vector).magnitude;
    }

    dot(vector) {
        if(this.dim !== vector.dim) {
            throw VectorDimensionError;
        }
        var dot_product = 0;
        for(var i = 0; i < this.dim; i++) {
            dot_product += this.elements[i] * vector.elements[i];
        }
        return dot_product;
    }

    interpolate(alpha, vector) {
        return this.plus(vector.minus(this).times(alpha));
    }

    normalize() {
        this.scale(1.0 / this.magnitude);
    }

    normalCopy() {
        var new_vect = this.clone();
        new_vect.normalize();
        return new_vect;
    }

    rotate(angle) {
        if(this.dim !== 2) {
            throw UnsupportedOperationError;
        }
        return new Vector(this.elements[0] * Math.cos(angle) - this.elements[1] * Math.sin(angle),
                          this.elements[0] * Math.sin(angle) + this.elements[1] * Math.cos(angle));
    }

    transform(offset, angle) {
        if(this.dim != 2) {
            throw UnsupportedOperationError;
        }
        if(this.dim != offset.dim){
            throw VectorDimensionError;
        }
        this.rotate(angle).add(offset);
    }

    average(vector) {
        return this.interpolate(0.5, vector);
    }

    getAngle() {
        if(this.dim != 2) {
            throw UnsupportedOperationError;
        }
        return Math.atan2(this.elements[1], this.elements[0]);
    }

    toString() {
        return this.elements.join(", ");
    }
}