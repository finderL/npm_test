/**
 * Created with JetBrains PhpStorm.
 * User: lijinsheng
 * Date: 13-6-26
 * Time: 下午4:08
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    module.exports = {
        checkChina : function(sInput) {
            var lst = /[\u0000-\u00ff]/;
            return !lst.test(sInput);
        },

        checkNums : function(sCodes) {
            if(sCodes.match(/^\d*$/)) {
                return true;
            } else {
                return false;
            }
        },

        checkMobilePhone : function(sMobilePhone) {
            var pattern = /^1[3458]\d{9}$/;
            if(pattern.exec(sMobilePhone)) {
                return true;
            } else {
                return false;
            }
        },

        checkTelephone : function(sTel) {
            var pattern = /^\d{10,12}$/;
            if(pattern.exec(sTel)) {
                return true;
            } else {
                return false;
            }
        },

        checkFloats : function(sCodes) {
            if(sCodes.match(/^\d+$|^\d+\.\d+$/)) {
                return true;
            } else {
                return false;
            }
        },

        checkEmailValid : function(sEMail) {
            var pattern = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
            if(pattern.exec(sEMail)) {
                return true;
            } else {
                return false;
            }
        }
    }
});