/**
 * Created with JetBrains PhpStorm.
 * User: lijinsheng
 * Date: 13-7-4
 * Time: 下午3:48
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var orderListModel = Backbone.Model.extend({
        defaults :{
            "orderid" : '',
            "userid" : 0,
            "order_data" : [],
            "order_stat" : 0,
            "payment_amount" : 0,
            "inserttime" : ''
        },

        urlRoot: '/api/my/order/getorderinfo/'
    });

    return orderListModel;
});