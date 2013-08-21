// 功能描述：切换导航，导航触发事件，相应的内容变化
define(function(require, exports, module) {
    var $ = require('jquery');
    module.exports = paging = function(dataSourceUrl,
        postContentPrefix,
        pageSize,
        pageContainer,
        noContentDisplay,
        displayContainer,
        renderContent) {
        var that = this;
        this._data_source_url = dataSourceUrl;
        this._post_content_prefix = postContentPrefix;
        this._page_size = pageSize;  //每页显示记录条数
        this._pager = pageContainer;
        this._no_content_display = noContentDisplay;
        this._render_Content = renderContent;
        this._display_container = displayContainer;
        
        this._allCount = 0;  //记录总条数
        this._pageNum = 0;  //总页数
        this._newcount = 0;

        this._loading = false;
        this._cache_data = new Array();
        this._current_data = null;
        this._content_template = null;
        this._pager_template = null;
        this._json_key = undefined;
        this._id_loading_obj = undefined;
        this._id_pagepre_obj = undefined;
        this._id_pagenext_obj = undefined;
        this._cur_original_data = undefined;
    };
    var _cp = paging.prototype;
    
    _cp.get_content_obj = function(){
        return $(this._display_container);
    };
    _cp.set_request_param = function(post_param){
        this._post_content_prefix = post_param;
    }
    _cp.get_cur_data = function(){
        return this._current_data;
    };
    _cp.set_loading_id = function(loading_id){
        this._id_loading_obj = $(loading_id);
    };
    
    _cp.set_json_key = function(json_key){
        this._json_key = json_key;
    };
    
    _cp._getPageStart = function (pageNum) {
        return this._page_size * pageNum;
    };
    
    _cp._isLoading = function () {
        return this._loading;
    };
    
    _cp._loadingBegin = function () {
        this._loading = true;
        this._id_loading_obj = this._id_loading_obj == undefined? $("#content_loading"):this._id_loading_obj;
        this._id_loading_obj.css("display", "block");
        var container = $(this._display_container);
        var noContentDisplay = $(this._no_content_display);
        container.css("display", "none");
        noContentDisplay.css("display", "none");
    };
    
    _cp._loadingEnd = function () {
        this._loading = false;
        this._id_loading_obj = this._id_loading_obj == undefined? $("#content_loading"):this._id_loading_obj;
        this._id_loading_obj.css("display", "none");
    };
    
    _cp.del_cache_data = function(){
        this._cache_data = new Array();
    };
    
    _cp._set_cache_data = function(pageNum, data, param){
        if(param == undefined){
            this._cache_data[pageNum] = data;
        }
        else{
            if(this._cache_data[param] == undefined){
                this._cache_data[param] = new Array();
            }
            this._cache_data[param][pageNum] = data;
        }
    };
    
    _cp._get_cache_data = function(pageNum, param){
        if(param == undefined){
            return this._cache_data[pageNum];
        }
        else {
            if(this._cache_data[param]){
                return this._cache_data[param][pageNum];
            }
            else{
                return undefined;
            }
        }
    };
    
    _cp._createRequest = function (pageNum,param) {
        var start = this._getPageStart(pageNum);
        var request = {
            url: this._data_source_url,         
            method: "GET",
            postContent: this._post_content_prefix + start,
            load: this._createRequestHandler(pageNum,param)
        };
        return request;
    };
    
    _cp._createRequestHandler = function (pageNum,param) {
        var paging = this;
        var fn = function (data, status) {
            if (!data.success) {
                paging._loadingEnd();
                var noContentDisplay = $(paging._no_content_display);
                noContentDisplay.css("display", "block");
                $(paging._pager).css("display", "none");
                $(paging._display_container).css("display", "none");
                return;
            }
            paging._set_original_data(data);
            paging._set_cache_data(pageNum, data, param);
            paging._allCount = paging._json_key === undefined? data.count:json[paging._json_key['count']];
            paging._current_data = paging._json_key === undefined?data.data:json[paging._json_key['data']];
            paging._newcount = paging._json_key === undefined ? data.newcount : json[paging._json_key['newcount']];
            paging._curPageNo = pageNum;
            paging._render(param);
            paging.noPage(pageNum);
            paging._loadingEnd();
            return;
        };
        return fn;
    };
    _cp._set_original_data = function(data){
        this._cur_original_data = data;
    };
    _cp.get_original_data = function(){
        return this._cur_original_data;
    };
    _cp.noPage = function(pageNo){
        var totalPageNum =  this._calcPageNum() - 1;
        var $pagerPre = $(this._pager).find(".ui-paging-prev");
        var $pagerNext = $(this._pager).find(".ui-paging-next");
        $pagerPre.removeClass("ui-paging-nopage");
        $pagerPre.attr("title","");
        $pagerNext.removeClass("ui-paging-nopage");
        $pagerNext.attr("title","");
        if(pageNo == 0){
            $pagerPre.addClass("ui-paging-nopage");
            $pagerPre.attr("title","已经是第一页了");
        }
        if(pageNo == totalPageNum){
            $pagerNext.addClass("ui-paging-nopage");
            $pagerNext.attr("title","已经是最后一页了");
        }
    };
    
    _cp.prePage = function (param){
        if(this._curPageNo == 0){
            return;
        }
        if(param !== undefined) {
            this.showPage(this._curPageNo - 1, param);
        }
        else{
            this.showPage(this._curPageNo - 1);
        }
    };
    
    _cp.nextPage = function (param){
        var totalPageNum =  this._calcPageNum() - 1;
        if(this._curPageNo == totalPageNum || totalPageNum == 0){
            return;
        }
        if(param !== undefined) {
            this.showPage(this._curPageNo + 1, param);
        }
        else{
            this.showPage(this._curPageNo + 1);
        }
    };
    _cp.getCurPageNo = function(){
        if(this._curPageNo == undefined || this._curPageNo == 0)
            return 0;
        else
            return this._curPageNo;
    }
    _cp.showPage = function (pageNum, param, fromCache){
        if (this._isLoading()) {
            return;
        }
        this._loadingBegin();
        var page_data = undefined;
        if( fromCache == undefined || fromCache == true)
            page_data = this._get_cache_data(pageNum, param);
        if(!page_data){
            var request = this._createRequest(pageNum,param);
            var ajaxParam = {
                type: request.method,
                url: request.url,
                data: request.postContent,
                dataType: "json",
                success :  request.load
            }
            $.ajax(ajaxParam);
        }
        else{
            this._allCount = this._json_key === undefined ? page_data.count : page_data[this._json_key['count']];
            this._current_data = this._json_key === undefined ? page_data.data : page_data[this._json_key['data']];
            this._newcount = this._json_key === undefined ? page_data.newcount : page_data[this._json_key['newcount']];
            this._curPageNo = pageNum;
            this._render(param);
            this.noPage(pageNum);
            this._loadingEnd();
            return;
        }
    };
    
    _cp._render = function (param) {
        this._setVisiable();
        if(this._render_Content){
            this._render_Content(this);
        }else{
            this._renderContent();
        }
        this._renderPager(param);
        this._turnPage(param);
        this._addFbClass();
    };

    _cp._turnPage = function (param) {
        var that = this;
        $(this._pager).find(".ui-paging-prev").unbind("click").click(function(){
            if(param !== undefined) {
                that.prePage(param);
            }
            else{
                that.prePage();
            }
        });
        $(this._pager).find(".ui-paging-next").unbind("click").click(function(){
            if(param !== undefined) {
                that.nextPage(param);
            }
            else{
                that.nextPage();
            }
        });
        $(this._pager).find(".ui-paging-items a").unbind("click").click(function(){
            var $self = $(this);
            var pageNum = parseInt($self.text()) - 1;
            if(param !== undefined) {
                that.showPage(pageNum, param);
            }
            else{
                that.showPage(pageNum);
            }
        });
    };
    
    _cp._setVisiable = function () {
        var $pager = $(this._pager);
        var container = $(this._display_container);
        var noContentDisplay = $(this._no_content_display);
    
        if (this._hasComment()) {
            if(container.is("tbody")) {
                container.css("display", "");
            }
            else{
                container.css("display", "block");
            }
            $pager.css({"display": "block"});
            noContentDisplay.css("display", "none");
        }
        else {
            container.css("display", "none");
            $pager.css({"display": "none"});
            noContentDisplay.css("display", "block");
        }
    };
    
    _cp._hasComment = function () {
        return this._current_data.length > 0;
    };
    
    _cp._renderContent = function (displayContent) {
        var container;
        if (typeof(displayContent) == "undefined") {
            container = $(this._display_container);
        } else {
            container = $(displayContent);
        }
        var template = this._getContentTemplate(container);
        var data = this._current_data;
        var count = data.length;
        var contentBuilder = [];
    
        for (var i = 0; i < count; ++i) {
            var text = template;
            if(data[i]['client_ip'])
                data[i]['client_ip'] = this.convert_ip(data[i]['client_ip']);
        
            for (var propertyName in data[i]) {
                text = text.replace(new RegExp("%" + propertyName + "%","g"), data[i][propertyName]);
            }
            contentBuilder.push(text);
        }
        container.html(contentBuilder.join(""));
    };
    
    _cp._getContentTemplate = function (container) {
        if (this._content_template === null) {
            this._content_template = container.html();
        }
        return this._content_template;
    };

    _cp._getPagerTemplate = function (pager) {
        if (this._pager_template === null) {
            this._pager_template = pager.html();
        }
        return this._pager_template;
    };
    
    _cp._renderPager = function (param) {
        var $pager = $(this._pager);
        //var content = this._getPagerTemplate($pager);

        //content = content.replace('<span class="ui-paging-items">', '<span class="ui-paging-items">' + this._getPageList(param));
        //content = content.replace('<span class="ui-paging-allcount frose">', '<span class="ui-paging-allcount frose">' + this._allCount);
        //content = content.replace('<span class="ui-paging-currentpage">', '<span class="ui-paging-currentpage">' + this._curPageNo + 1);
        //content = content.replace('<span class="ui-paging-allpage">', '<span class="ui-paging-allpage">' + this._calcPageNum());

        //$pager.html(content);
        $pager.find(".ui-paging-items").html(this._getPageList(param));
        $pager.find(".ui-paging-allcount").html(this._allCount);
        $pager.find(".ui-paging-currentpage").html(this._curPageNo + 1);
        $pager.find(".ui-paging-allpage").html(this._calcPageNum());
    };
    
    _cp._calcPageNum = function (){
        this._pageNum = Math.ceil(this._allCount / this._page_size);
        return this._pageNum;
    };
    _cp._gotoLastPageNum = function(){
        var lastPageNum = Math.ceil((this._allCount + 1) / this._page_size);
        return lastPageNum - 1;
    }
    _cp._getPageList = function (){
        var startNo = 0;
        var endNo = 0;
        var currentPage = this._curPageNo + 1;
        var htmString = "";
        var htmlPoints = "<span class=\"ui-paging-item-ellipsis\";>...</span>";
        var totalPageNum =  this._calcPageNum();
        var result = [];
        if(totalPageNum <= 10){
            startNo = 2;
            endNo = totalPageNum - 1;
        }
        else{
            if(currentPage > 5 && currentPage <= totalPageNum - 5){
                startNo = currentPage - 3;
                endNo = currentPage + 3;
            }
            else if(currentPage > totalPageNum - 5){
                startNo = totalPageNum - 7;
                endNo = totalPageNum - 1;
            }
            else{
                startNo = 2;
                endNo = 9;
            }
        }
        for(var i = startNo; i <= endNo; i ++) {
            if(i == currentPage){
                htmString += '<a href="javascript:void(0);" class="ui-paging-item-current"><span>' + i + '</span></a>';
            }
            else {
                htmString += '<a href="javascript:void(0);"><span>' + i + "</span></a>";
            }
        }
        if(totalPageNum <= 10){
            htmString = htmString;
        }
        else{
            if(currentPage > 5 && currentPage <= totalPageNum - 5){
                htmString = htmlPoints + htmString + htmlPoints;
            }
            else if(currentPage > totalPageNum - 5){
                htmString = htmlPoints + htmString;
            }
            else{
                htmString = htmString + htmlPoints;
            }
        }
        if(totalPageNum == 1) {
            result = '<a href="javascript:void(0);" class="firstPage ui-paging-item-current"><span>1</span></a>';
        }
        else {
            if(currentPage == 1) {
                result = '<a href="javascript:void(0);" class="firstPage ui-paging-item-current"><span>1</span></a>' + htmString + '<a href="javascript:void(0);" class="lastPage"><span>' + totalPageNum + '</span></a>';
            }
            else {
                result = '<a href="javascript:void(0);" class="firstPage"><span>1</span></a>' + htmString + '<a href="javascript:void(0);" class="lastPage"><span>' + totalPageNum + '</span></a>';
            }
        }
        return result;
    };
    
    _cp._addFbClass = function (){
        var currentPage = this._curPageNo + 1;
        var totalPageNum =  this._calcPageNum();
        var $firstPageObj = $(".firstPage");
        var $lastPageObj = $(".lastPage");
        if(currentPage == 1){
            $firstPageObj.addClass("ui-paging-item-current");
        }
        else if(currentPage == totalPageNum){
            $lastPageObj.addClass("ui-paging-item-current");
        }
        else{
            $firstPageObj.removeClass("ui-paging-item-current");
            $lastPageObj.removeClass("ui-paging-item-current");
        }
    };
    
    _cp.convert_ip = function(ip){
        var converted_ip;
        converted_ip = ip.split(".");
        return converted_ip[0] + "." + converted_ip[1] + "." + converted_ip[2] + "." + "*";
    };
});