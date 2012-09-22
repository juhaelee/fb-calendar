define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/add-event.html',
	'collections/calendars',
	'collections/events'
	], function($, _, Backbone, addEventTemplate, calendarCollection, eventCollection){
		var addEventView = Backbone.View.extend({
			template: _.template(addEventTemplate),
			events: {
				'click #exit_addEvent' : 'removeAddEvent',
				'click #createEvent' : 'createNewEvent'
			},
			initialize: function(){
				this.render();
				calendarCollection.on('add', this.render, this);
				calendarCollection.on('destroy', this.render, this);
			},
			render: function(){
				var myCalendars = new Backbone.Collection();
				_.each(calendarCollection.myCalendars(), function(calendar){ myCalendars.push(calendar)});
				$(this.el).html(this.template($.extend({}, {calendars: myCalendars.pluck("name")})));
				return this;
			},
			removeAddEvent: function(){
				this.render();
				$("#add-event").css("visibility", "hidden");
				$(".bg-table-day").removeClass("selectday");
			},
			createNewEvent: function(){
				var colorModel = calendarCollection.find(function(calendar){return calendar.get("name") == $("#event-details select").val().trim();});
				if($("#event-details select").val() == null){
					alert("Please add a calendar to add an event");
				}
				else{
					eventCollection.add({
						name: $("#event-details input[name=name]").val().trim(),
						detail: $("#event-details textarea[name=details]").val().trim(), 
						color: colorModel.get("color"),
						owner: "myself",
						location: $("#event-details input[name=where]").val().trim(),
						startday: $("#event-details input[name=startfromday]").val().trim(),
						starttime: $("#event-details input[name=startfromtime]").val().trim(),
						endday: $("#event-details input[name=endtoday]").val().trim(),
						endtime: $("#event-details input[name=endtotime]").val().trim(),
						calendar: $("#event-details select").val(),
					});
				}
				this.removeAddEvent();
			}
		});
		
	return addEventView;
	
});