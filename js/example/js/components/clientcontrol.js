/**
 * Created with JetBrains PhpStorm.
 * User: sihuayin
 * Date: 13-6-26
 * Time: 上午10:23
 * To change this template use File | Settings | File Templates.
 */
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define (function(require, exports, module) {
    function clientcontrol(){
        this.ActiveXObj = undefined;
    }
    clientcontrol.prototype.get_client_version = function(){
        var obj = this.get_client_obj();
        if(!obj)
            return "";
        else{
            try{
                return obj.GetClientFullVersion();
            }
            catch(ex){
                return "";
            }
        }

    }
    clientcontrol.prototype.get_client_pc_type = function(){
        var obj = this.get_client_obj();
        if(!obj)
            return "";
        else{
            try{
                return obj.GetPCManufacturer();
            }
            catch(ex){
                return "";
            }
        }

    }
    clientcontrol.prototype.get_client_harddevice = function(){
        var obj = this.get_client_obj();
        if(!obj)
            return "";
        else{
            try{
                return obj.GetHardwareData();
            }
            catch(ex){
                return "";
            }
        }

    }
    clientcontrol.prototype.get_client_obj = function(){
        if(!this.ActiveXObj){
            try{
                this.ActiveXObj = new ActiveXObject("ET.ETClientHelper");
            }
            catch(ex){
                return null;
            }
        }
        return this.ActiveXObj;
    }
    clientcontrol.prototype.get_download_percent = function(courseguid, lessonguid){
        var obj = this.get_client_obj();
        if(!obj)
            return 0;
        else{
            try{
                return obj.GetLessonDownload(courseguid, lessonguid);
            }
            catch(ex){
                return 0;
            }
        }
    }
    clientcontrol.prototype.export_mp3 = function(user_name, session, course, realguid, lesson, auth_type) {
        var obj = this.get_client_obj();
        if (!obj)
            return -1;
        else {
            try {
                obj.Authtype = auth_type;
                obj.CourseId = course;
                obj.CourseRId = realguid;
                obj.LessonId = lesson;
                obj.UserName = user_name;
                obj.ExportLessonAudio(session);
                return 1;
            }
            catch (ex) {
                return -1;
            }
        }
    }
    return clientcontrol;
});

