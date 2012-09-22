define(['underscore', 'backbone'], function(_, Backbone){
	var EventModel = Backbone.Model.extend({
		defaults: {
			"name": null,
			"detail": null,
			"color": "#000000",
			"owner": null,
			"location": null,
			"startday": null,
			"endday": null,
			"starttime": null,
			"endtime": null,
			"attendees": [],
			"private": false,
			"calendar": null,
			"price": null,
		}
	});
	return EventModel;
});