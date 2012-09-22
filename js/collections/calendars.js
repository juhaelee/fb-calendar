define([
	'underscore',
	'backbone',
	'models/calendar',
	], function(_, Backbone, Calendar){
	var CalendarsCollection = Backbone.Collection.extend({
		model: Calendar,
		myCalendars: function(){
			return this.filter(function(calendar){ 
				return calendar.get('owner') == 'myself';
			});
		},
		otherCalendars: function(){
			return this.without.apply(this, this.myCalendars());
		},
		visibleCalendars: function(){
			return this.filter(function(calendar){ 
				return calendar.get('visible') == true;
			});
		},
	});
	return new CalendarsCollection();
});