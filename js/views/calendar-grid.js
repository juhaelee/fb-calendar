define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/calendar-grid.html',
	'models/default',
	'models/date',
	'views/calendar-month'
	], function($, _, Backbone, calendarGridTemplate, defaultModel, todayModel, calendarMonthView ){
		var CalendarGridView = Backbone.View.extend({
			template: _.template(calendarGridTemplate),
			events: {
			},
			initialize: function(){
				this.render();
				var calendarMonth = new calendarMonthView({ el: $("#calendar-month") });
			},
			render: function(){
				$(this.el).html(this.template($.extend({}, defaultModel.toJSON(), todayModel.toJSON() )));
				return this;
			},
		});
		
	return CalendarGridView;
	
});