define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/menu.html',
	'models/date',
	'models/default',
	'collections/calendars',
	'views/calendars',
	'views/add-event'
	], function($, _, Backbone, menuTemplate, todayModel, defaultModel, calendarCollection, calendarView){
		var MenuView = Backbone.View.extend({
			template: _.template(menuTemplate),
			events: {
				'click #menu_right_prevnextmonth_prevmonth' : 'showPrevMonth',
				'click #menu_right_prevnextmonth_nextmonth' : 'showNextMonth',
				'click #menu_right_today' : 'showToday',
				'click #menu_left_mycalendars' : 'showMyCalendars',
				'click #menu_left_friendscalendars' : 'showFriendsCalendars',
				'click #cal-dropdown_top_addNewCal' : 'addNewCalendar',
				'click' : 'removeAddEvent'
			},
			initialize: function(){
				this.render();
				todayModel.on('change:currentMonth', this.render, this);
				todayModel.on('change:currentYear', this.render, this);
				defaultModel.on('change:calendarOption', this.render, this);
				defaultModel.on('change:calendarOption', this.addAllCalendar, this);
				calendarCollection.on('destroy', this.addAllCalendar, this);
			},
			render: function(){
				this.addAllCalendar();
				$('#' + defaultModel.get("calendarType")).addClass("selected");
				$(this.el).html(this.template($.extend({}, todayModel.toJSON(), defaultModel.toJSON())));
				return this;
			},
			//events
			showPrevMonth: function(){
				todayModel.decreaseMonth();
				defaultModel.setCalendarOption(null);
			},
			showNextMonth: function(){
				todayModel.increaseMonth();
				defaultModel.setCalendarOption(null);
			},
			showToday: function(){
				todayModel.setToday();
				defaultModel.setCalendarOption(null);
			},
			showMyCalendars: function(){
				defaultModel.setCalendarOption("#menu_left_mycalendars");
			},
			showFriendsCalendars: function(){
				defaultModel.setCalendarOption("#menu_left_friendscalendars");
			},
			addOneCalendar: function(calendar){
				var view = new calendarView({model: calendar});
				$('#cal-dropdown_bottom').append(view.render().el);
			},
			addAllCalendar: function(){
				if(defaultModel.get("calendarOption") == "#menu_left_mycalendars"){
					$('#cal-dropdown_bottom').html('');
					_.each(calendarCollection.myCalendars(), this.addOneCalendar);
				}
			},
			addNewCalendar: function(){
				if( $("input").val().trim() == ""){
					alert("Please input a calendar name");
				}
				else {
					calendarCollection.add({name: $("input[name=addNewCalendar]").val().trim(), owner: "myself"});
					$("input[name=addNewCalendar]").val("");
					this.addAllCalendar();
				}
			},
			removeAddEvent: function(){
				$(".bg-table-day").removeClass("selectday");
				$("#add-event").css("visibility", "hidden");
				$("#add-event").css("display", "none");
			}
		});
		
	return MenuView;
		
});