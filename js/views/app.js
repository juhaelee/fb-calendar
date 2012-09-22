define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/main.html',
	'views/menu',
	'views/calendar-grid',
	'views/add-event'
	], function($, _, Backbone, mainTemplate, menuView, calendarGridView, addEventView){
		var AppView = Backbone.View.extend({
			el: $("#main"),
			template: _.template(mainTemplate),
			events: {
			},
			initialize: function(){
				this.render();
				var menu = new menuView({ el: $("#menu") });
				var calendarGrid = new calendarGridView({ el: $("#calendar") });
				var addEvent = new addEventView({ el: $("#add-event") });
			},
			render: function(){
				$(this.el).html(this.template());
				return this;
			}
		});
		
	return AppView;
		
});