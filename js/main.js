require.config({
	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		}
	},
	paths: {
		jquery: 'libs/jquery/jquery-1.8.0.min',
		underscore: 'libs/underscore/underscore-min',
		backbone: 'libs/backbone/backbone-min',
		text: 'libs/require/text'
	}
});

require(['views/app'], function(AppView){
	var app_view = new AppView();
});