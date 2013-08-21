/**
 * 课程数据集合
 * User: shy
 * Date: 13-4-7
 * Time: 上午11:09
 * 课程的列表，我的课程，免费课等的展示
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var exerciseListModel = require('../models/exerciselistmodel');
    var exercise = new exerciseListModel;

    var exerciseCollection = Backbone.Collection.extend({
        model : exerciseListModel,
        initialize : function () {
            //this.fetch();
        },

        parse: function(data) {
            var datas = data.data;
            if( data.success == true ){
                $("J_contentLoadingAll").addClass("fn-hide");
                $("#more_items").addClass("fn-hide");
                return datas;
            }else{
                $("#more_items").removeClass("fn-hide");
                return ;
            }
        }
    });

    return exerciseCollection;

});
