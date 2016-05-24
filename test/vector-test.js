var Vector = require('../dist/Vector.js'),
    chai = require('chai');

chai.should();

var UnsupportedOperationError = {
    name: "Invalid Arguments Exception",
    message: "Unable to perform operation on given vector"
};

var VectorDimensionError = {
    name: "Invalid Arguments Exception",
    message: "Vectors dimensions do not match"
};


describe('Vector', function() {
    describe('Vector Operations', function() {
        describe('Addition', function() {
            it('fails if dimensions do not match', function() {
                var vect1 = new Vector([1]),
                    vect2 = new Vector([1,1]);
                (function(){vect1.add(vect2);}).should.throw(VectorDimensionError);
            });
            it('works in 1 dimension', function() {
                var vect1 = new Vector([1]),
                    vect2 = new Vector([1]);
                vect1.add(vect2);
                vect1.elements.should.eql([2]);
            });
            it('works in 2 dimensions', function() {
                var vect1 = new Vector([1,3]),
                    vect2 = new Vector([1,-3]);
                vect1.add(vect2);
                vect1.elements.should.eql([2,0]);
            });
            it('works in high dimensions', function() {
                var vect1 = new Vector([1,3,1,3,1,3,1,3]),
                    vect2 = new Vector([1,-3,1,-3,1,-3,1,-3]);
                vect1.add(vect2);
                vect1.elements.should.eql([2,0,2,0,2,0,2,0]);
            });
        });
        describe('Plus', function() {
            it('fails if dimensions do not match', function() {
                var vect1 = new Vector([1]),
                    vect2 = new Vector([1,1]);
                (function(){vect1.plus(vect2);}).should.throw(VectorDimensionError);
            });
            it('works in 1 dimension', function() {
                var vect1 = new Vector([1]),
                    vect2 = new Vector([1]);
                (vect1.plus(vect2)).elements.should.eql([2]);
            });
            it('works in 2 dimensions', function() {
                var vect1 = new Vector([1,3]),
                    vect2 = new Vector([1,-3]);
                (vect1.plus(vect2)).elements.should.eql([2,0]);
            });
            it('works in high dimensions', function() {
                var vect1 = new Vector([1,3,1,3,1,3,1,3]),
                    vect2 = new Vector([1,-3,1,-3,1,-3,1,-3]);
                (vect1.plus(vect2)).elements.should.eql([2,0,2,0,2,0,2,0]);
            });
        });
        describe('Subtraction', function() {
            it('fails if dimensions do not match', function() {
                var vect1 = new Vector([1]),
                    vect2 = new Vector([1,1]);
                (function(){vect1.subtract(vect2);}).should.throw(VectorDimensionError);
            });
            it('works in 1 dimension', function() {
                var vect1 = new Vector([1]),
                    vect2 = new Vector([1]);
                vect1.subtract(vect2);
                vect1.elements.should.eql([0]);
            });
            it('works in 2 dimensions', function() {
                var vect1 = new Vector([1,3]),
                    vect2 = new Vector([1,-3]);
                vect1.subtract(vect2);
                vect1.elements.should.eql([0,6]);
            });
            it('works in high dimensions', function() {
                var vect1 = new Vector([1,3,1,3,1,3,1,3]),
                    vect2 = new Vector([1,-3,1,-3,1,-3,1,-3]);
                vect1.subtract(vect2);
                vect1.elements.should.eql([0,6,0,6,0,6,0,6]);
            });
        });
        describe('Minus', function() {
            it('fails if dimensions do not match', function() {
                var vect1 = new Vector([1]),
                    vect2 = new Vector([1,1]);
                (function(){vect1.minus(vect2);}).should.throw(VectorDimensionError);
            });
            it('works in 1 dimension', function() {
                var vect1 = new Vector([1]),
                    vect2 = new Vector([1]);
                (vect1.minus(vect2)).elements.should.eql([0]);
            });
            it('works in 2 dimensions', function() {
                var vect1 = new Vector([1,3]),
                    vect2 = new Vector([1,-3]);
                (vect1.minus(vect2)).elements.should.eql([0,6]);
            });
            it('works in high dimensions', function() {
                var vect1 = new Vector([1,3,1,3,1,3,1,3]),
                    vect2 = new Vector([1,-3,1,-3,1,-3,1,-3]);
                (vect1.minus(vect2)).elements.should.eql([0,6,0,6,0,6,0,6]);
            });
        });
        describe('Clone', function() {
            it('works', function() {
                var vect1 = new Vector([1,3,4,6,-10]),
                    vect2 = vect1.clone();
                vect1.should.eql.vect2;
            });
        });
        describe('Distance', function() {
            it('fails if dimensions do not match', function() {
                var vect1 = new Vector([1]),
                    vect2 = new Vector([1,1]);
                (function(){vect1.distance(vect2);}).should.throw(VectorDimensionError);
            });
            it('works in 1 dimension', function() {
                var vect1 = new Vector([1]),
                    vect2 = new Vector([1]);
                (vect1.distance(vect2)).should.equal(0);
            });
            it('works in 2 dimensions', function() {
                var vect1 = new Vector([1,3]),
                    vect2 = new Vector([1,-3]);
                (vect1.distance(vect2)).should.equal(6);
            });
            it('works in high dimensions', function() {
                var vect1 = new Vector([1,3,1,3,1,3,1,3]),
                    vect2 = new Vector([1,-3,1,-3,1,-3,1,-3]);
                (vect1.distance(vect2)).should.equal(12);
            });
        });
        describe('Dot Product', function() {
            it('fails if dimensions do not match', function() {
                var vect1 = new Vector([1]),
                    vect2 = new Vector([1,1]);
                (function(){vect1.dot(vect2);}).should.throw(VectorDimensionError);
            });
            it('works in 1 dimension', function() {
                var vect1 = new Vector([1]),
                    vect2 = new Vector([1]),
                    dot_product = vect1.dot(vect2);
                dot_product.should.equal(1);
            });
            it('works in 2 dimensions', function() {
                var vect1 = new Vector([1,3]),
                    vect2 = new Vector([1,-3]),
                    dot_product = vect1.dot(vect2);
                dot_product.should.equal(-8);
            });
            it('works in high dimensions', function() {
                var vect1 = new Vector([1,3,1,3,1,3,1,3]),
                    vect2 = new Vector([1,-3,1,-3,1,-3,1,-3]),
                    dot_product = vect1.dot(vect2);
                dot_product.should.equal(-32);
            });
        });
        describe('Normalize', function() {
            var norm_vect1 = new Vector([1]),
                norm_vect2 = new Vector([1,0]),
                norm_vect3 = new Vector([1,0,0]),
                norm_vect4 = new Vector([1/Math.sqrt(2), 1/Math.sqrt(2)]),
                TOLERANCE = 0.00000001;
            it('works if vector is already unit vector', function() {
                var vect1 = norm_vect1.clone(),
                    vect2 = norm_vect2.clone(),
                    vect3 = norm_vect3.clone(),
                    vect4 = norm_vect4.clone();
                vect1.normalize();
                vect2.normalize();
                vect3.normalize();
                vect4.normalize();
                compare_vects_with_tol(vect1, norm_vect1, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect2, norm_vect2, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect3, norm_vect3, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect4, norm_vect4, TOLERANCE).should.equal(true);
            });
            it('works if vector has magnitude > 1', function() {
                var vect1 = new Vector([5]),
                    vect2 = new Vector([5,0]),
                    vect3 = new Vector([10,0,0]),
                    vect4 = new Vector([10,10]);
                vect1.normalize();
                vect2.normalize();
                vect3.normalize();
                vect4.normalize();
                compare_vects_with_tol(vect1, norm_vect1, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect2, norm_vect2, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect3, norm_vect3, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect4, norm_vect4, TOLERANCE).should.equal(true);
            });
            it('works if vector has magnitude < 1', function() {
                var vect1 = new Vector([0.1]),
                    vect2 = new Vector([0.5,0]),
                    vect3 = new Vector([0.1,0,0]),
                    vect4 = new Vector([0.2,0.2]);
                vect1.normalize();
                vect2.normalize();
                vect3.normalize();
                vect4.normalize();
                compare_vects_with_tol(vect1, norm_vect1, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect2, norm_vect2, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect3, norm_vect3, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect4, norm_vect4, TOLERANCE).should.equal(true);
            });
        });
        describe('Normal Copy', function() {
            var norm_vect1 = new Vector([1]),
                norm_vect2 = new Vector([1,0]),
                norm_vect3 = new Vector([1,0,0]),
                norm_vect4 = new Vector([1/Math.sqrt(2), 1/Math.sqrt(2)]),
                TOLERANCE = 0.00000001;
            it('works if vector is already unit vector', function() {
                var vect1 = norm_vect1.normalCopy(),
                    vect2 = norm_vect2.normalCopy(),
                    vect3 = norm_vect3.normalCopy(),
                    vect4 = norm_vect4.normalCopy();
                compare_vects_with_tol(vect1, norm_vect1, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect2, norm_vect2, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect3, norm_vect3, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect4, norm_vect4, TOLERANCE).should.equal(true);
            });
            it('works if vector has magnitude > 1', function() {
                var vect1 = (new Vector([5])).normalCopy(),
                    vect2 = (new Vector([5,0])).normalCopy(),
                    vect3 = (new Vector([10,0,0])).normalCopy(),
                    vect4 = (new Vector([10,10])).normalCopy();
                compare_vects_with_tol(vect1, norm_vect1, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect2, norm_vect2, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect3, norm_vect3, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect4, norm_vect4, TOLERANCE).should.equal(true);
            });
            it('works if vector has magnitude < 1', function() {
                var vect1 = (new Vector([0.1])).normalCopy(),
                    vect2 = (new Vector([0.5,0])).normalCopy(),
                    vect3 = (new Vector([0.1,0,0])).normalCopy(),
                    vect4 = (new Vector([0.2,0.2])).normalCopy();
                compare_vects_with_tol(vect1, norm_vect1, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect2, norm_vect2, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect3, norm_vect3, TOLERANCE).should.equal(true);
                compare_vects_with_tol(vect4, norm_vect4, TOLERANCE).should.equal(true);
            });
        });
    });
    describe('Scalar Operations', function() {
        describe('Magnitude', function() {
            it('works for the zero vector', function() {
                var vector = new Vector([0, 0, 0]);
                vector.magnitude.should.equal(0);
            });
            it('works for 1 dimension', function() {
                var vector = new Vector([3]);
                vector.magnitude.should.equal(3);
            });
            it('works for 2 dimension', function() {
                var vector = new Vector([3, 4]);
                vector.magnitude.should.equal(5);
            });
            it('works for higher dimension', function() {
                var vector = new Vector([3, 4, 5]),
                    expected_value = Math.sqrt(3 * 3 + 4 * 4 + 5 * 5);
                vector.magnitude.should.equal(expected_value);
            });
        });
        describe('Scale', function() {
            it('works when vector is 0', function() {
                var vector = new Vector([0, 0]);
                vector.scale(0);
                vector.elements.should.eql([0, 0]);
            });
            it('works when scalar is 0', function() {
                var vector = new Vector([4, 5, 12]);vector
                vector.scale(0);
                vector.elements.should.eql([0, 0, 0]);
            });
            it('works when scalar is positive', function() {
                var vector = new Vector([4, 5, 12]);
                vector.scale(4);
                vector.elements.should.eql([16, 20, 48]);
            });
            it('works when scalar is negative', function() {
                var vector = new Vector([4, 5, 12]);
                vector.scale(-4);
                vector.elements.should.eql([-16, -20, -48]);
            });
        });
        describe('Times', function() {
            it('works when vector is 0', function() {
                var vector = new Vector([0, 0]);
                (vector.times(10)).elements.should.eql([0, 0]);
            });
            it('works when scalar is 0', function() {
                var vector = new Vector([4, 5, 12]);
                (vector.times(0)).elements.should.eql([0, 0, 0]);
            });
            it('works when scalar is positive', function() {
                var vector = new Vector([4, 5, 12]);
                (vector.times(4)).elements.should.eql([16, 20, 48]);
            });
            it('works when scalar is negative', function() {
                var vector = new Vector([4, 5, 12]);
                (vector.times(-4)).elements.should.eql([-16, -20, -48]);
            });
        });
    });
});

var compare_vects_with_tol = function(vect1, vect2, tol) {
    if(vect1.dim !== vect2.dim) {
        return false;
    }
    for(var i = 0; i < vect1.dim; i++) {
        if(Math.abs(vect1.elements[i] - vect2.elements[i]) > tol) {
            return false;
        }
    }
    return true;
}