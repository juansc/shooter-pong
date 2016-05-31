Errors = {
    "UnsupportedOperationError": {
        name: "Invalid Arguments Exception",
        message: "Unable to perform operation on given vector"
    },
    "VectorDimensionError": {
        name: "Invalid Arguments Exception",
        message: "Vectors dimensions do not match"
    }
};

Compare = {
    "vects_with_tol" : (vect1, vect2, tol) => {
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
}

exports.Errors = () => {return Errors};
exports.Compare = () => {return Compare};