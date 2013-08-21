/**
 * 所有模板
 * User: Administrator
 * Date: 13-4-7
 * Time: 上午11:32
 * 所有的模板页面都放在一起，放入CDN中缓存起来
 */
define(function(require, exports, module) {
    exports.courseItem = "<p><a href='#courses/<%= id %>'><%= id %>..<%= name %></a></p><p><%= subject %></p><p><%= publishState %></p><p><%= years %></p>";
    exports.courseContainer = '<p>首页>我的书屋>正式课</p><div class="filter"><p>学科:<span class="subject_list"><%= subjects%></span></p><p>年级:<span class="years_list"><%= grades%></span></p><p>发布状态:<span class="publish_list"><%= publishStates %></span></p></div><div class="courselist"><%= courseList %></div>';
});