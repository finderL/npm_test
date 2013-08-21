/**
 * 模块课激活
 * User: sihuayin
 * Date: 13-6-28
 * Time: 上午10:20
 * 页面处理
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var JSON = require("json");
    var activeItem = require("./activemoduleitemview");
    var templates = require("../../html/activemodule.html");
    var oneAcitve = null;

    var activeModuleModel = new Backbone.Model();
    var activeModuleCollection = new Backbone.Collection({model:activeModuleModel});

    activeModuleCollection.url = baseUrl + "/api/my/active/activemodule/";


    var activeModuleView = Backbone.View.extend({
        el : "#content",
        template:_.template(templates),
        events : {
            "click #J_moduleList td a" : "showModuleInfo"
        },

        initialize : function () {
            this.listenTo(activeModuleCollection, "reset", this.render);
            activeModuleCollection.fetch({reset : true});
        },

        render : function () {
            this.$el.html(this.template({data : activeModuleCollection.toJSON()}));
        },

        showModuleInfo : function (e) {
            var pid = $(e.currentTarget).attr("pid");
            var cid = $(e.currentTarget).attr("cid");
            var parentDom = $(e.currentTarget).parents("tr");
            var moduleData = {};
            var currentModule = this.getModuleByPid(pid);

            if (currentModule.module_new == 0) {
                moduleData = JSON.parse(currentModule.module_info);
            } else if (currentModule.module_new == 1) {
                moduleData = JSON.parse(currentModule.module_info)[cid];
            }
            moduleData.course_name = currentModule.course_name;
            moduleData.course_guid = currentModule.course_guid;
            moduleData.active_code = currentModule.active_code;
            if (oneAcitve) {
                oneAcitve.remove();
            }
            oneAcitve = new activeItem(moduleData, parentDom);
        },

        getModuleByPid : function(pid) {
            for (var temp in activeModuleCollection.toJSON()) {
                if (temp == pid) {
                    return activeModuleCollection.toJSON()[pid];
                }
            }
            return {};
        }
    });

    return activeModuleView;
});