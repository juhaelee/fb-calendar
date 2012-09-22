define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/calendars.html',
	], function($, _, Backbone, calendarsTemplate){
		var CalendarView = Backbone.View.extend({
			template: _.template(calendarsTemplate),
			events: {
				'click #singleCalendar_delete' : 'deleteCalendar',
			},
			initialize: function(){
				this.model.on('change', this.render, this);
			},
			render: function(){
				$(this.el).html(this.template(this.model.toJSON()));
				return this;
			},
			//events
			deleteCalendar: function(){
				this.model.destroy();
			}
			
		});
		
	return CalendarView;
		
});