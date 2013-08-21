/**
 * 地区选取组件
 * User: shy
 * Date: 13-5-14
 * Time: 上午11:45
 * 用户地区表单联动的地方
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var JSON = require("json");
    var areaInfo = [
        ["北京","北京"],
        ["天津","天津"],
        ["河北","石家庄|保定|唐山|廊坊|张家口|承德|沧州|秦皇岛|衡水|邢台|邯郸"],
        ["山西","太原|大同|临汾|吕梁|忻州|晋中|晋城|朔州|运城|长治|阳泉"],
        ["内蒙古","呼和浩特|包头|赤峰|呼伦贝尔|乌兰察布|通辽|乌海|兴安盟|巴彦淖尔|鄂尔多斯|锡林郭勒盟|阿拉善盟"],
        ["辽宁","沈阳|大连|葫芦岛|丹东|抚顺|朝阳|本溪|盘锦|营口|辽阳|铁岭|锦州|阜新|鞍山"],
        ["吉林","长春|吉林|通化|四平|松原|白城|白山|辽源|延边州"],
        ["黑龙江","哈尔滨|大庆|佳木斯|鹤岗|七台河|伊春|双鸭山|牡丹江|绥化|鸡西|黑河|齐齐哈尔|大兴安岭"],
        ["上海","上海"],
        ["江苏","南京|苏州|南通|宿迁|常州|徐州|扬州|无锡|泰州|淮安|盐城|连云港|镇江"],
        ["浙江","杭州|宁波|绍兴|温州|台州|嘉兴|丽水|湖州|舟山|衢州|金华"],
        ["安徽","合肥|芜湖|安庆|亳州|六安|宣城|宿州|巢湖|池州|淮北|淮南|滁州|蚌埠|铜陵|阜阳|马鞍山|黄山"],
        ["福建","福州|厦门|泉州|漳州|三明|南平|宁德|莆田|龙岩"],
        ["江西","南昌|九江|抚州|赣州|上饶|吉安|宜春|新余|景德镇|萍乡|鹰潭"],
        ["山东","济南|青岛|威海|泰安|德州|日照|枣庄|济宁|淄博|滨州|潍坊|烟台|聊城|莱芜|菏泽|东营|临沂"],
        ["河南","郑州|洛阳|濮阳|安阳|三门峡|信阳|南阳|周口|商丘|平顶山|开封|新乡|济源|漯河|焦作|许昌|驻马店|鹤壁"],
        ["湖北","武汉|荆州|荆门|襄阳|仙桃|十堰|咸宁|天门|孝感|宜昌|恩施|潜江|神农架|鄂州|随州|黄冈|黄石"],
        ["湖南","长沙|株洲|湘潭|娄底|岳阳|常德|张家界|怀化|永州|湘西州|益阳|衡阳|邵阳|郴州"],
        ["广东","广州|深圳|东莞|茂名|中山|云浮|佛山|惠州|揭阳|梅州|汕头|汕尾|江门|河源|清远|湛江|潮州|珠海|肇庆|阳江|韶关"],
        ["广西","南宁|桂林|北海|柳州|玉林|崇左|来宾|梧州|河池|百色|贵港|贺州|钦州|防城港"],
        ["海南","海口|三亚|省直辖"],
        ["重庆","重庆"],
        ["四川","成都|绵阳|乐山|德阳|内江|南充|宜宾|巴中|广元|广安|攀枝花|泸州|眉山|自贡|资阳|达州|遂宁|雅安|甘孜州|凉山州|阿坝州"],
        ["贵州","贵阳|遵义|六盘水|安顺|毕节|铜仁|黔东南州|黔南州|黔西南州"],
        ["云南","昆明|玉溪|丽江|保山|临沧|普洱|曲靖|大理州|德宏州|怒江州|迪庆州|文山州|昭通|楚雄州|红河州|西双版纳州"],
        ["西藏","拉萨|日喀则|昌都|林芝|阿里|山南"],
        ["陕西","西安|咸阳|宝鸡|榆林|汉中|延安|渭南|铜川|商洛|安康"],
        ["甘肃","兰州|天水|张掖|武威|白银|酒泉|嘉峪关|定西|平凉|庆阳|金昌|陇南|临夏|甘南州"],
        ["青海","西宁|果洛州|海东|海北州|海南州|海西州|玉树州|黄南州"],
        ["宁夏","银川|中卫|吴忠|固原|石嘴山"],
        ["新疆","乌鲁木齐|克拉玛依|吐鲁番|塔城|喀什|伊犁州|巴音郭楞州|昌吉州|石河子|阿克苏|阿勒泰|克孜勒苏柯尔克孜州|博尔塔拉州|和田|哈密|五家渠|阿拉尔"]
    ];
    var provinceNames = [];
    var citys = {};

    var max_level = 3;
    var data_name = '';
    for (var i = 0; i < areaInfo.length; ++i) {
        var info = areaInfo[i];
        provinceNames.push(info[0]);
        citys[info[0]] = info[1].split("|");
    }

    var service_url =  "/api/district/";
    var return_temp = [];

    module.exports = {
        _selecter_ids : [],
        _selecters : [],
        _alertItems : [],
        _onchangeFns : [],
        _defaultValues : [],
        _returnData : [],
        _data_name : "",
        _grade : '',
        //districtItems 数据格式 : [{selectId : "11", alertItem : {value : "", text : "qu"}, defaultValue : "aa", changeFn : ""},{}..]
        init : function (districtItems, data_name, grade) {
            this._data_name = data_name;
            if(grade) {
                this._grade = grade;
            }
            for (var i = 0; i < districtItems.length; i++) {
                this._selecter_ids[i] = districtItems[i].selectId;
                this._selecters[i] = $("#" + this._selecter_ids[i]);
                this._alertItems[i] = districtItems[i].alertItem;
                this._onchangeFns[i] = districtItems[i].changeFn;
                this._defaultValues[i] = districtItems[i].defaultValue;
            }


            this._init_values_fns();

            this._init_lever_selecter(0, true);
            return true;
        },

        _init_lever_selecter : function (level, setDefaultValue) {
            var selecter = this._get_selecter_item(level);
            if (!selecter) {
                return;
            }
            var values = this._get_values_fn(level)(this);
            var me = this;
            this._init_selecter(selecter, values, this._get_alert_item(level), this._get_change_fn(level,this));
            if (setDefaultValue) {
                setTimeout(
                    function (){
                        var defaultValue = me._get_item(me._defaultValues, level);
                        if (defaultValue) {
                            selecter.val(defaultValue);
                        }
                        me._init_lever_selecter(level + 1, setDefaultValue);
                    }, 10);
            } else {
                this._init_lever_selecter(level + 1);
            }
        },

        _init_selecter : function (selecter, values, alertItem, onchangeFn) {
            selecter.html("");
            if (alertItem) {
                selecter.append(this._create_option(alertItem.value, alertItem.text));
            }
            if (values) {
                var i = 0;
                if(values instanceof Array){
                    for (i = 0; i < values.length; ++i) {
                        selecter.append(this._create_option(values[i], values[i]));
                    }
                }
                else if(values instanceof Object){

                    var value_data = values.value;
                    var text_data = values.text;
                    for(i = 0; i < value_data.length; i ++){
                        selecter.append(this._create_option(value_data[i], text_data[i]));
                    }
                }
            }
            if (onchangeFn) {
                selecter.off("change");
                selecter.on("change", "", this, onchangeFn);
            }
        },

        _create_option : function (value, text) {
            var option = $("<option/>", {
                    value: value,
                    text: text
                });
            return option;
        },

        _get_values_fn : function (level) {
            if (level < 0 || level > max_level || level >= this._selecters.length) {
                return null;
            }
            if (level > 0) {
                var selecter = this._get_selecter_item(level - 1);
                if (selecter.val() == this._get_alert_item(level - 1).value) {
                    return function () {
                        return [];
                    };
                }
            }
            return this.fns[level];
        },

        _get_item : function (items, level) {
            if (!items || level < 0 || level >= items.length) {
                return null;
            }
            return items[level];
        },

        _get_selecter_item : function(level) {
            return this._get_item(this._selecters, level);
        },

        _get_alert_item : function(level) {
            return this._get_item(this._alertItems, level);
        },

        _get_change_fn : function (level,me) {
            return function () {
                var childSelecter = me._get_selecter_item(level + 1);
                if (childSelecter) {
                    me._init_lever_selecter(level + 1);
                    if (level == 0) {
                        var provinceSelecter = me._get_selecter_item(level);
                        if(!citys[provinceSelecter.val()]) return;
                        if (citys[provinceSelecter.val()].length == 1) {
                            setTimeout(
                                function (){
                                    childSelecter.val(citys[provinceSelecter.val()][0]) ;
                                    me._init_lever_selecter(level + 2);
                                }, 10);
                        }
                    }
                }
                var fn = me._get_item(me._onchangeFns, level);
                if (fn) {
                    fn();
                }
                //if (level < max_level) {
                //    me._get_change_fn(level + 1,me)();
                //}
            };
        },

        _init_values_fns : function () {
            this.fns = [];
            this.fns[0] = function () {
                return provinceNames;
            };
            this.fns[1] = function (that) {
                var provinceSelecter = that._get_selecter_item(0);

                return citys[provinceSelecter.val()];
            };
            this.fns[2] = function (that) {

                var provinceSelecter = that._get_selecter_item(0);
                var citySelecter = that._get_selecter_item(1);
                return that._getAreaData(provinceSelecter.val(), citySelecter.val(), that._get_data_callback);
            };
            this.fns[3] = function (that) {
                var provinceSelecter = that._get_selecter_item(0);
                var citySelecter = that._get_selecter_item(1);
                var areaSelecter = that._get_selecter_item(2);
                var districtType = '';
                if(that.grade){
                    var gradeSelecter = $("#" + me.grade);
                    var grade_name = '';
                    if(!gradeSelecter){
                        grade_name = that.grade;
                    }
                    if (grade_name == "高三" || grade_name == "高二" || grade_name == "高一" || grade_name == "高中")
                        districtType = "senior";
                    else if (grade_name == "初三" || grade_name == "初二" || grade_name == "初一" || grade_name == "初中")
                        districtType = 'junior';

                }
                return that._getSchoolData(provinceSelecter.val(), citySelecter.val(), areaSelecter.val(),districtType,
                    that._get_data_callback);
            };
        },
        _getAreaData : function (province, city, fn) {
            //var data = encodeURIComponent(province) + "/" + encodeURIComponent(city) + "/";
            var data = "area/" + encodeURIComponent(province) + "/" + encodeURIComponent(city) + "/";
            return this._request(data, fn);
        },

        _getSchoolData : function (province, city, school,district_type, fn) {
            var data = "school/" + encodeURIComponent(province) + "/" + encodeURIComponent(city) + "/" + encodeURIComponent(school);
            if(district_type) {
                data += district_type + '/';
            }
            return this._request(data, fn);
        },

        refreshSchools : function() {
            this._init_lever_selecter(3);
        },

        getSchoolName : function(schoolName) {
            var data = "";
            return this._request(data,this._renderSchool);
        },

        _renderSchool : function(json, type, http) {
            this.classObj = $("#iclassname");
            this.classSelectObj = $("#iclassname_select");
            this.classSelectObj.html("");
            this.classSelectObj.appendChild(this._createOption("", "请选择班级名称"));
            var classData = data.split(',');
            for (var i = 0; i < classData.length; i++) {
                this.classSelectObj.appendChild(this._createOption(classData[i], classData[i]));
            }
            this.classObj.style.display = "block";
        },

        _request : function(data, fn) {
            var result = null;
            $.ajax({
                async: false,
                type: "GET",
                url:service_url.concat(data) ,
                contentType: "charset=utf-8",
                data: "",
                dataType : "json",
                success: function (json, type, http) {
                    result = fn(json, type, http);
                }
            });
            return result;
        },

        _get_data_callback : function (json, type, http) {
            var return_temp = [];
            if (type != "success") {
                alert("读取数据出错，请您重试");
                return;
            }

            var data = json;
            for (var i = 0; i < json.length; ++i) {
                return_temp.push(data[i]["districtname"]);
            }
            return return_temp;
        },

        _get_select_value : function($dom) {
            return $dom.val();
        },

        submit : function(callback_fn,otherParam) {
            var provinceObj = this._get_selecter_item(0);
            var districtObj = this._get_selecter_item(1);
            var subDistrictObj = this._get_selecter_item(2);
            var schoolObj = this._get_selecter_item(3);
            var gradeObj = $("#" + this._grade);
            var classSelectObj = $("#iclassify");
            var data = otherParam == undefined?{}:otherParam;

            data.province = encodeURIComponent(this._get_select_value(provinceObj));
            data.city = encodeURIComponent(this._get_select_value(districtObj));
            data.area = encodeURIComponent(this._get_select_value(subDistrictObj));
            data.school = encodeURIComponent(this._get_select_value(schoolObj));
            data.gradeName = encodeURIComponent(this._get_select_value(gradeObj));
            data.userFigure = user_data.userFigure;
            if (user_data.userFigure == 0) { //学生
                if (data.gradeName == '高三' || data.gradeName == '高二') {
                    data.subjectClassify = this._get_select_value($("#iclassname"));
                } else {
                    data.subjectClassify = 0;
                }
                if ($("#iclassname").css("display") == "block") {
                    data.className = this._get_select_value(classSelectObj);
                    if (data.className == "") {
                        alert("请选择你所在的班级名称");
                        return;
                    }
                } else {
                    data.className = "";
                }
            }  else if (user_data.userFigure == 1) {
                var subjectName = this._get_select_value(this.subjectObj);
                if (subjectName == "") {
                    alert("请选择学科信息");
                    return;
                }

                data.subject = this._get_select_value(this.subjectObj);
            }
            this.submitfn = function() {
                alert("ddd");
            };
            this.updateDistrictInfo(data, callback_fn);
        },
        updateDistrictInfo : function(data,callBackFunc){
            $.ajax({
                type : 'put',
                data : data,
                dataType : 'json',
                url : '/api/my/info/joindirectlesson/',
                success : function() {
                    callBackFunc();
                },
                error : function(data) {
                    var errorText = JSON.parse(data.responseText);
                    alert("错误码 : " + errorText.errorNo + " " + errorText.error);
                    callBackFunc();
                }
            })
        }
    }

});