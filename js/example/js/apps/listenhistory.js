define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var listenHistoryview = require("../views/listenhistoryview");

    exports.init = function() {
        var listenHistory = new listenHistoryview();
        return listenHistory;
    }
});

