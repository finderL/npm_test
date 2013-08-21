/**
 * 网页启动简单课堂模块
 * User: sihuayin
 * Date: 13-7-24
 * Time: 上午11:07
 * 在网页中调用ie插件，启动简单课堂听课
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var cookie = require('cookie');
    var listen = function (){
        this.ActiveXObj = undefined;
        this.userName = "";//登录时的用户名
        this.listenType = "0";//听课类型 '0'表示体验 '1'表示听课
        this.logonState = "0";//是否登录 '0'表示未登录，'1'表示登录
        this.ctrlId = "";
        this.lastClientVersion = "2.22.0.71";
        this.lastControlVersion = "2.22.0.00";
        this.server = baseUrl ;
        this.curClientVersion = "";
        this.curControlVersion = "";
        this.refreshCookieName = "";
        this.interval_check_software = "";
        this.obj = undefined;
        return this;
    };
    listen.prototype.setUserName = function(userName){
        this.userName = userName;
    };
    listen.prototype.setListenType = function(listenType){
        this.listenType = listenType;
    };
    listen.prototype.setLogonState = function(logonState){
        this.logonState = logonState;
    };

    listen.prototype.loadActiveXObj=function (loadMode,ctrlId){
        this.ctrlId = !ctrlId ? "listen_ctrl" : ctrlId;

        if(loadMode){

            var obj = document.createElement("div");

            obj.innerHTML = "<object classid=\"clsid:012F24D4-35B0-11D0-BF2D-0000E8D0D166\""
                + "id=\"" + this.ctrlId + "\""
                + "codebase=\"" + etWebSiteUrl + "/software/ETClientHelper.dll#version=2,20,0,12\""
                + "width=\"0\" height=\"0\"></object>";
            document.body.appendChild(obj);
        }
        else{
            document.write("<object classid=\"clsid:012F24D4-35B0-11D0-BF2D-0000E8D0D166\"");
            document.write(" codebase=\"" + this.server + "/software/ETClientHelper.dll#version=2,20,0,12\"");
            document.write(" id=\"" + this.ctrlId + "\"");
            document.write(" width=\"0\" height=\"0\">");
            document.write("</object>");
        }
    };
    listen.prototype.isLoadActiveXObj = function(){
        var obj = $("#" + this.ctrlId);
        return obj?true:false;
    };

    listen.prototype.removeActiveXObj = function(){
        $('body').remove("#" + this.ctrlId)
    };

    listen.prototype.createActiveXObj = function(){

        try{
            this.ActiveXObj = $("#" +this.ctrlId);
            if(!this.ActiveXObj){
                this.loadActiveXObj(true);
                this.ActiveXObj = $("#" + this.ctrlId);
                return true;
            }
        }
        catch(ex){
            return false;
        }
    };
    listen.prototype.isLastControlVersion = function(){
        var split_char = "";
        var version = this.getCurControlVersion();
        split_char = this.getSplitChar(version);
        var version_arr = version.split(split_char);
        split_char = this.getSplitChar(this.lastControlVersion);
        var lastversion_arr = this.lastControlVersion.split(split_char);
        version = parseInt(version_arr[0] + version_arr[1], 10);
        var last_version = parseInt(lastversion_arr[0] + lastversion_arr[1], 10);
        return version >= last_version ? true : false;
    };
    listen.prototype.getSplitChar = function(version){
        var split_char = "";
        if(version.indexOf(",") != -1)
            split_char = ",";
        else if(version.indexOf(".") != -1)
            split_char = ".";
        else split_char = ".";
        return split_char;
    };

    listen.prototype.isLastControlVersionByObj=function(obj){
        try{
            var split_char = "";
            var version = obj.GetControlFullVersion();
            split_char = this.getSplitChar(version);
            var version_arr = version.split(split_char);
            split_char = this.getSplitChar(this.lastControlVersion);
            var lastversion_arr = this.lastControlVersion.split(split_char);
            version = parseInt(version_arr[0] + version_arr[1], 10);


            var last_version = parseInt(lastversion_arr[0] + lastversion_arr[1], 10);

            return version >= last_version?0:-2;
        }
        catch(e){
            return -1;
        }
    };

    listen.prototype.getCurClientVersion = function(){
        try{
            if(!this.obj)
                this.obj = new ActiveXObj("ET.ETClientHelper");
            this.curClientVersion = this.obj.GetClientFullVersion();
            return this.curClientVersion;
        }
        catch(ex){
            return "";
        }
    };

    listen.prototype.getCurControlVersion = function(){
        try{
            if(!this.obj)
                this.obj = new ActiveXObj("ET.ETClientHelper");
            this.curControlVersion = this.obj.GetControlFullVersion();
            return this.curControlVersion;
        }
        catch(ex){
            return "0.0.00";
        }
    };

    listen.prototype.isIe = function () {
        return /msie/.test(navigator.userAgent.toLowerCase()) ? true : false;
    }
    listen.prototype.isInstallActiveX = function(){
        try{
            this.obj = new ActiveXObject("ET.ETClientHelper");
            return this.isLastControlVersion()?0:-2;
        }
        catch(ex){
            return -1;
        }

    }
    listen.prototype.start = function(course,lesson,section){
        if(this.isInstallActiveX() == 0){
            this.ActiveXObj = this.obj;
        }
        else
            this.createActiveXObj();
        if(this.ActiveXObj){
            if(course)
                this.ActiveXObj.CourseId = course;
            if(lesson)
                this.ActiveXObj.LessonId = lesson;
            if(section)
                this.ActiveXObj.SectionId = section;
            this.ActiveXObj.UserName = this.userName;
            this.ActiveXObj.SignedIn = this.logonState;
            this.ActiveXObj.CallType = this.listenType;
            this.ActiveXObj.Server = this.server;
            try{
                this.ActiveXObj.put_ExpectVersion(this.lastClientVersion);

            }
            catch(ex){}
            this.ActiveXObj.Launch();
        }
    }
    listen.prototype.listenPartLesson = function(course,lesson,section,callback){
        if(!course || !lesson || !section)
            return false;
        if(this.isInstallActiveX() == 0){
            this.ActiveXObj = this.obj;
            this.ActiveXObj.UserName = "0000";
            this.ActiveXObj.SignedIn = 0;
            this.ActiveXObj.CallType = 0;
            this.ActiveXObj.Server = this.server;
            this.ActiveXObj.CourseID = course;
            this.ActiveXObj.LessonID = lesson;
            this.ActiveXObj.SectionID = section;
            try{

                this.ActiveXObj.put_ExpectVersion(this.lastClientVersion);
            }
            catch(ex){}
            this.ActiveXObj.Launch();
            return true;
        }
        else{
            $.cookie("UserName", "0000",{
                expires:1,
                path:'/'
            });
            $.cookie("CourseID", course,{
                expires:1,
                path:'/'
            });
            $.cookie("LessonID",lesson,{
                expires:1,
                path:'/'
            });
            $.cookie("SectionID",section,{
                expires:1,
                path:'/'
            });
            $.cookie("SignedIn",0,{
                expires:1,
                path:'/'
            });
            $.cookie("CallType",0,{
                expires:1,
                path:'/'
            });
            if(!callback)
                window.location.href = this.server + "/software/oneclick/ETClientInstaller.exe";
            else
                callback();
            return true;
        }
    };

    listen.prototype.listenLesson = function(username,realcourse, course, lesson, quit, authtype, callback) {
        if(!course || !lesson)
            return false;
        if(this.isInstallActiveX() == 0){
            if(username){
                this.ActiveXObj = this.obj;
                this.ActiveXObj.UserName = username;
                this.ActiveXObj.SignedIn = 1;
                this.ActiveXObj.QuitAsFinished = quit;
                this.ActiveXObj.CourseID = course;
                this.ActiveXObj.LessonID = lesson;
                try{

                    this.ActiveXObj.put_ExpectVersion(this.lastClientVersion);
                    this.ActiveXObj.AuthType = authtype;
                    this.ActiveXObj.Server = this.server;
                    this.ActiveXObj.CourseRId = realcourse;

                }
                catch(ex){ }

                this.ActiveXObj.Launch();

            }
            else{
                window.location.href = this.server + "/user/register";
            }
            return true;
        }
        else{
            $.cookie("UserName", username,{
                expires:1,
                path:'/'
            });
            $.cookie("CourseID", course,{
                expires:1,
                path:'/'
            });
            $.cookie("CourseRID", realcourse, {
                expires:1,
                path:'/'
            });
            $.cookie("LessonID",lesson,{
                expires:1,
                path:'/'
            });
            $.cookie("SignedIn",1,{
                expires:1,
                path:'/'
            });
            $.cookie("QuitAsFinished", quit, {
                expires:1,
                path:'/'
            });
            $.cookie("AuthType", authtype, {
                expires:1,
                path:'/'
            });
            $.cookie("DownloadPath", this.server,{
                expires:1,
                path:'/'
            });
            if (!username) {
                // not login, to register.
                window.location.href = this.server + "/user/register";
                return true;
            }
            if(!callback)
                window.location.href = this.server + "/software/oneclick/ETClientInstaller.exe";
            else
                callback();
            return true;

        }
    }

    listen.prototype.setStartCookie = function(username, course, lesson, quit, authtype) {
        $.cookie("UserName", username,{
            expires:1,
            path:'/'
        });
        $.cookie("CourseID", course,{
            expires:1,
            path:'/'
        });
        $.cookie("LessonID",lesson,{
            expires:1,
            path:'/'
        });
        $.cookie("SignedIn",1,{
            expires:1,
            path:'/'
        });
        $.cookie("QuitAsFinished", quit,{
            expires:1,
            path:'/'
        });
        $.cookie("DownloadPath", this.server,{
            expires:1,
            path:'/'
        });
        $.cookie("AuthType", authtype, {
            expires:1,
            path:'/'
        });
    }

    listen.prototype.toLessonPerfectSection = function (courseId, lessonId) {
        if ((!courseId) || (!lessonId)) {
            return;
        }
        var self = this;
        this._getLessonPerfectSectionId(lessonId, function (sectionId) {
            self.listenPartLesson(courseId, lessonId, sectionId);
        });

        return;
    }

    listen.prototype._getLessonPerfectSectionId = function (lessonId, callBack) {
        var ajax_obj = new etajax();
        ajax_obj.request_url = etWebSiteUrl + '/svr/course.php';
        ajax_obj.request_method = "POST";
        ajax_obj.async = true;
        ajax_obj.request_content = "do=getlessonperfectsection&l=" + lessonId;
        ajax_obj.send(function (type, json, http) {
            if (!json['success']) {
                alert('该讲课程暂无试听内容,请您选择其他讲次试听内容');
                // location.href = location.href;
                return;
            }
            callBack(json['data']);
        });
    }
    listen.prototype.setRefreshState = function(cookieName){
        $.cookie(cookieName,1,{
            expires:1,
            path:'/'
        });
    }
    listen.prototype.loadListenActiveObj = function(cookieName, objId,intervalCallbackFn){
        var load_object = $.cookie(cookieName);
        if(load_object == 1){
            var obj = document.createElement("div");

            obj.innerHTML = "<object classid=\"clsid:012F24D4-35B0-11D0-BF2D-0000E8D0D166\""
                + "id=\"" + objId + "\""
                + "codebase=\"" + etWebSiteUrl + "/software/ETClientHelper.dll#version=2,20,0,12\""
                + "width=\"0\" height=\"0\"></object>";
            document.body.appendChild(obj);
            $.cookie(cookieName,null,{
                path:'/'
            });
            this.interval_check_software = setInterval(intervalCallbackFn, 1000);
        }

    }
    listen.prototype.isSetRefreshState=function(cookieName){
        var load_object = $.cookie(cookieName);
        return load_object == 1?true:false;
    }
    listen.prototype.clearCheckSoftware = function(){
        clearInterval(this.interval_check_software);

    }

    return listen;
});