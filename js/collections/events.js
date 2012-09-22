define([
	'underscore',
	'backbone',
	'models/event',
	'models/date'
	], function(_, Backbone, Event, dateModel){
	var EventsCollection = Backbone.Collection.extend({
		model: Event,
		calendarEvent: function(cal){
			return this.filter(function(event){
				var dayMonthYearStart = event.get('startday').split("/");
				var thisMonth = parseInt(dateModel.get('monthNames').indexOf(dateModel.get('currentMonth'))) +1;
				return event.get('calendar') == cal && parseInt(dayMonthYearStart[0]) == thisMonth;
			});
		},
	});
	return new EventsCollection();
});