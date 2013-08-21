/*map start*/
seajs.production = true;
if(seajs.production){
    seajs.config({
        map : [
	[
		"base/handlebars.js",
		"base/handlebars-6d116fb6bb720ff21b4fcae44d02fa0e.js"
	],
	[
		"js/apps/router.js",
		"js/apps/router-d41d8cd98f00b204e9800998ecf8427e.js"
	]
]
    });
}
/*map end*/
seajs.config({
    alias : {
        '$' : 'gallery/jquery/1.9.1/jquery',
        '_' : 'gallery/underscore/1.4.4/underscore',
        'handlebars' : 'gallery/handlebars/1.0.2/handlebars',
        'example-handlebars' : '/js/example/base/handlebars',
        "jquery" : "gallery/jquery/1.9.1/jquery",
        "underscore" : "gallery/underscore/1.4.4/underscore",
        "backbone" : "gallery/backbone/backbone-min",
        "cookie" : "gallery/jquery.cookie",
        "json" : "gallery/json/json2"
    },
    preload : [
        seajs.production ? 'seajs/seajs-style/1.0.0/seajs-style' : 'seajs/seajs-text/1.0.0/seajs-text-debug'
    ]
});