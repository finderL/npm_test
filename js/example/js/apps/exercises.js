define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var exercisesView = require("../views/exercisesview");
    var myexr = null;
    exports.init = function(courseType) {
        if (myexr) {
            myexr.remove();
        }
        myexr = new exercisesView();
        return myexr;
    }
});

