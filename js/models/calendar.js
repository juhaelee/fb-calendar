define(['underscore', 'backbone'], function(_, Backbone){
	var CalendarModel = Backbone.Model.extend({
		defaults: {
			"name": null,
			"color": "#5B74A8",
			"owner": null,
			"visible": true,
			"private": false,
		}
	});
	return CalendarModel;
});