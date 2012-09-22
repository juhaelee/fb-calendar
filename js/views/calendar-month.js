define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/calendar-month.html',
	'models/default',
	'models/date',
	'views/add-event',
	'collections/calendars',
	'collections/events',
	'views/events'
	], function($, _, Backbone, eventsTemplate, defaultModel, todayModel, addEventView, calendarCollection, eventCollection, eventView){
		var CalendarMonthView = Backbone.View.extend({
			template: _.template(eventsTemplate),
			events: {
				'click .bg-table-day' : 'addEvent',
			},
			initialize: function(){
				this.render();
				todayModel.on('change:currentYear', function(){
					todayModel.setYear();
				});
				todayModel.on('change:currentMonth', this.render, this);
				todayModel.on('change:currentYear', this.render, this);
				eventCollection.on('add', this.render, this);
			},
			render: function(){
				$(this.el).html(this.template($.extend({}, defaultModel.toJSON(), todayModel.toJSON(), {today: this.getGridRowColumn(todayModel.get("currentDayMonth"), todayModel.get("currentTodayMonth"))} )));
				this.addAllEvents();
				return this;
			},
			addEvent: function(e){
				if($(e.currentTarget).hasClass("selectday")){
					$(".bg-table-day").removeClass("selectday");
					$("#add-event").css("visibility", "hidden");
					$("#add-event").css("display", "none");
				}
				else {
					$(".bg-table-day").removeClass("selectday");
					$("#add-event").css("visibility", "visible");
					$("#add-event").css("display", "block");
					$(e.currentTarget).addClass("selectday");
					if(e.pageY < $("#add-event").height() + 77){
						$("#prong").removeClass("bottom-prong").addClass("top-prong");
						$("#prong-img-01").removeClass("prong-db").addClass("prong-dt");
						$("#prong-img-02").removeClass("prong-lb").addClass("prong-lt");
						$("#add-event").css("top", e.pageY + 12);
					}
					else {
						$("#prong").removeClass("top-prong").addClass("bottom-prong");
						$("#prong-img-01").removeClass("prong-dt").addClass("prong-db");
						$("#prong-img-02").removeClass("prong-lt").addClass("prong-lb");
						$("#add-event").css("top", e.pageY - ($("#add-event").height()) - 12);
					}
					if(e.pageX > ($(document).width()-($("#add-event").width()/2)-16)){
						$("#prong").css("left", 182 + (e.pageX - ($(document).width()-($("#add-event").width()/2)-16)) );
						$("#add-event").css("left", e.pageX - (e.pageX - ($(document).width()-($("#add-event").width()/2))) - 9 - $("#add-event").width()/2);
					}
					else if(e.pageX < (($("#add-event").width())/2)){
						$("#prong").css("left", 182 - (182 - e.pageX) - 19);
						$("#add-event").css("left", $(document).width()-($(document).width()-e.pageX)-e.pageX+8);
					}
					else {
						$("#prong").css("left", 182);
						$("#add-event").css("left", e.pageX - (($("#add-event").width())/2) + 7);
					}
					$("input[name='name']").val("");
					$("textarea[name='details']").val("");
					$("input[name='where']").val("");
					var num = $(e.currentTarget).index();
					var selectedDay = $.trim($(e.currentTarget).parent().parent().parent().parent().find('.grid').find('#dayNumber').children().eq(num).text()).match(/[0-9]+/g);
					if($(e.currentTarget).parent().parent().parent().parent().find('.grid').find('#dayNumber').children().eq(num).children().css("color") == 'rgb(170, 170, 170)'){
						if(selectedDay > 20){
							if(todayModel.get("currentMonth") === "January"){
								$("input[name='startfromday']").val(12+'/'+selectedDay+'/'+(parseInt(todayModel.get("currentYear"))-1));
							}
							else {
								$("input[name='startfromday']").val((todayModel.get("monthNames").indexOf(todayModel.get("currentMonth")))+'/'+selectedDay+'/'+todayModel.get("currentYear"));
							}
						}
						else{
							if(todayModel.get("currentMonth") === "December"){
								$("input[name='startfromday']").val(1+'/'+selectedDay+'/'+(parseInt(todayModel.get("currentYear"))+1));
							}
							else{
								$("input[name='startfromday']").val((todayModel.get("monthNames").indexOf(todayModel.get("currentMonth"))+2)+'/'+selectedDay+'/'+todayModel.get("currentYear"));
							}
						}
					}
					else {
						$("input[name='startfromday']").val((todayModel.get("monthNames").indexOf(todayModel.get("currentMonth"))+1)+'/'+selectedDay+'/'+todayModel.get("currentYear"));
					}
					$("input[name='startfromtime']").val("");
					if($(e.currentTarget).parent().parent().parent().parent().find('.grid').find('#dayNumber').children().eq(num).children().css("color") == 'rgb(170, 170, 170)'){
						if(selectedDay > 20){
							if(todayModel.get("currentMonth") === "January"){
								$("input[name='endtoday']").val(12+'/'+selectedDay+'/'+(parseInt(todayModel.get("currentYear"))-1));
							}
							else {
								$("input[name='endtoday']").val((todayModel.get("monthNames").indexOf(todayModel.get("currentMonth")))+'/'+selectedDay+'/'+todayModel.get("currentYear"));
							}
						}
						else{
							if(todayModel.get("currentMonth") === "December"){
								$("input[name='endtoday']").val(1+'/'+selectedDay+'/'+(parseInt(todayModel.get("currentYear"))+1));
							}
							else{
								$("input[name='endtoday']").val((todayModel.get("monthNames").indexOf(todayModel.get("currentMonth"))+2)+'/'+selectedDay+'/'+todayModel.get("currentYear"));
							}
						}
					}
					else {
						$("input[name='endtoday']").val((todayModel.get("monthNames").indexOf(todayModel.get("currentMonth"))+1)+'/'+selectedDay+'/'+todayModel.get("currentYear"));
					}
					$("input[name='endtotime']").val("");
				}
			},
			createGrid: function(){
				var searchGrid = [];
				var daynum = todayModel.get("dayNames").indexOf(todayModel.get("startDays")[todayModel.get("monthNames").indexOf(todayModel.get("currentMonth"))]); //this gives me how many blank spaces i need
				for(var x = 0; x < daynum; x++){
					searchGrid.push("");
				}
				for(var y = 0; y < todayModel.get("totalDays")[todayModel.get("monthNames").indexOf(todayModel.get("currentMonth"))]; y++){
					searchGrid.push(y+1);
				}
				var tempGridLength = searchGrid.length%7
				for(var z = 0; z < (7 - tempGridLength); z++){
					searchGrid.push("");
				}
				return searchGrid;	
			},
			createAvailabilityGrid: function(){
				var availabilityGrid = [];
				var daysThisMonth = parseInt(todayModel.get("totalWeeksPerMonth")[todayModel.get("monthNames").indexOf(todayModel.get("currentMonth"))])*7;
				for(var i = 0; i < daysThisMonth; i++){
					availabilityGrid[i] = {top: false, middle: false, bottom: false, overflow: false};
				}
				return availabilityGrid;
			},
			getGridRowColumn: function(day, month){
				if(day > 0 && day <= todayModel.get("totalDays")[todayModel.get("monthNames").indexOf(month)]){
					var tempGrid = this.createGrid();
					var rowAndColumn = [];
					rowAndColumn.push( (tempGrid.indexOf(day)%7)+1);
					rowAndColumn.push( Math.ceil((tempGrid.indexOf(day)+1)/7));
					return rowAndColumn; //return x and y coordinates of the day
				}
				else {
					console.log("day out of month range");
				}
			},
			addOneEvent: function(event, availabilityGrid){
				var monthDayYear = event.get("startday").split("/");
				var monthDayYearEnd = event.get("startday").split("/");
				var datebegin = new Date(event.get("startday"));
				var dateend = new Date(event.get("endday"));
				var totdays = Math.ceil((dateend-datebegin)/86400000);
				var eventRowColumn = this.getGridRowColumn(parseInt(monthDayYear[1]), todayModel.get("monthNames")[parseInt(monthDayYear[0])-1]);
				var numRows = Math.ceil((totdays+eventRowColumn[0])/7);
				var totdaysweek, numcols;
				if(monthDayYear[2] == todayModel.get("currentYear") || monthDayYearEnd[2] == todayModel.get("currentYear")){
					for(var i = 0; i < numRows; i++){
						if(i == 0){
							if(numRows == 1){
								totdaysweek = totdays+1;
							}
							else{
								totdaysweek = 7 - eventRowColumn[0]+1;
								totdays -= totdaysweek;
							}
						}
						else if(i > 0 && i < numRows-1){
							eventRowColumn[0] = 1;
							eventRowColumn[1] += 1;
							numcols = 0;
							totdaysweek = 7;
							totdays -= totdaysweek;
						}
						else if(i == numRows-1){
							eventRowColumn[0] = 1;
							eventRowColumn[1] += 1;
							numcols = 0;
							totdaysweek = totdays+1;
						}
						else{
							alert("error- calendar-month.js");
						}
						var view = new eventView({model: event});
						if(availabilityGrid[(eventRowColumn[1]-1)*7+eventRowColumn[0]-1]["top"] == false){
							var numcols = 0;			
							var tot = 0;
							$("#eventsTable").find(".month-row").eq(eventRowColumn[1]-1).find(".grid").find("tr").eq(1).find("td").each(function() {
								if(tot < eventRowColumn[0]-1){
									if($(this).attr('colspan')){
										numcols += +$(this).attr('colspan');
										numcols--;
										tot += numcols;
									}
									else{
										tot++;
									}
								}
							});
							$("#eventsTable").find(".month-row").eq(eventRowColumn[1]-1).find(".grid").find("tr").eq(1).find("td").eq(eventRowColumn[0]-numcols-1).replaceWith(view.render(eventRowColumn, totdaysweek, numcols, 1).el);
						}
						else{
							if(availabilityGrid[(eventRowColumn[1]-1)*7+eventRowColumn[0]-1]["middle"] == false){
								//this is for single day events
								var numcols = 0;			
								var tot = 0;
								var colsAfter = false;
								$("#eventsTable").find(".month-row").eq(eventRowColumn[1]-1).find(".grid").find("tr").eq(2).find("td").each(function() {
									if(tot < eventRowColumn[0]-1){
										if($(this).attr('colspan')){
											numcols += +$(this).attr('colspan');
											numcols--;
											tot += numcols;
										}
										else{
											tot++;
										}
									}
									if(tot >= eventRowColumn[0]-1){
										if($(this).attr('colspan')){
											colsAfter = true;
										}
									}
								});
								var numTrue = 0;
								//finding number of true before the column
								for(j = (eventRowColumn[1]-1)*7; j < (eventRowColumn[1]-1)*7+eventRowColumn[0]; j++){
									if(availabilityGrid[j]["top"] == true){
										numTrue++;
									}
								}
								// CHECK IF THE col before the column you are looking in exists
								var colBeforeDoesntExist = true;			
								var tot = 0;
								$("#eventsTable").find(".month-row").eq(eventRowColumn[1]-1).find(".grid").find("tr").eq(1).find("td").each(function() {
									if(tot < eventRowColumn[0]){
										if($(this).attr('colspan')){
											tot += +$(this).attr('colspan');
											if(tot >= eventRowColumn[0]-1){
												colBeforeDoesntExist = false;
											}
										}
										else{
											tot++;
										}
									}
								});
								
								//add real event
								if(event.get("startday") == event.get("endday") && numcols == 0 && (colBeforeDoesntExist == true || colsAfter == true)){
									$("#eventsTable").find(".month-row").eq(eventRowColumn[1]-1).find(".grid").find("tr").eq(2).find("td").eq(numTrue-1).replaceWith(view.render(eventRowColumn, totdaysweek).el);
								}
								else{
									//this is to figure out how many "dummy" tds we need to put in before the event
									var dummyNums = 0;
									var startingpos = (eventRowColumn[1]-1)*7;
									for(var j = (eventRowColumn[1]-1)*7; j < (eventRowColumn[1]-1)*7+eventRowColumn[0]-1; j++){
										if(availabilityGrid[j]["middle"] == true){
											startingpos = j;
										}
									}
									for(var j = startingpos; j < (eventRowColumn[1]-1)*7+eventRowColumn[0]-1; j++){
										if(availabilityGrid[j]["top"] == true && availabilityGrid[j]["middle"] == false){
											dummyNums++;
										}
									}
									// add dummy td
									for(var j = 0; j < dummyNums; j++){
										$("#eventsTable").find(".month-row").eq(eventRowColumn[1]-1).find(".grid").find("tr").eq(2).append('<td rowspan="2"></td>');
									} 
									$("#eventsTable").find(".month-row").eq(eventRowColumn[1]-1).find(".grid").find("tr").eq(2).append(view.render(eventRowColumn, totdaysweek).el);
								}
							}
						}
					}
				}
			},
			addAllEvents: function(){
				var availabilityGrid = this.createAvailabilityGrid();
				var visibleCalendars = _.map(calendarCollection.visibleCalendars(), function(cal) {return cal.get("name");});
				var visibleEvents = new Backbone.Collection;
				for(var x = 0; x < visibleCalendars.length; x++){
					 visibleEvents.add(eventCollection.calendarEvent(visibleCalendars[x]));
				}
				//sort by earliest to latest events
				var earlyEvents = visibleEvents.sortBy(function(event){
					return new Date(event.get("startday")).getTime();
				});
				visibleEvents.reset();
				for(var x = 0; x < earlyEvents.length; x++){
					visibleEvents.add(earlyEvents[x]);
				}
				//bring multi-events to front
				var tempArray = [];
				for(var x = 0; x < visibleEvents.length; x++){
					if(visibleEvents.at(x).get("endday") != visibleEvents.at(x).get("startday")){
						tempArray.push(visibleEvents.at(x));
					}
				}
				for(var x = tempArray.length-1; x > -1; x--){
					visibleEvents.remove(tempArray[x]);
					visibleEvents.unshift(tempArray[x]);
				}
				var that = this;
				visibleEvents.each(function(event){
					that.addOneEvent(event, availabilityGrid);
					var monthDayYear = event.get("startday").split("/");
					var monthDayYearEnd = event.get("endday").split("/");
					var eventRowColumnBegin = that.getGridRowColumn(parseInt(monthDayYear[1]), todayModel.get("monthNames")[parseInt(monthDayYear[0])-1]);
					var eventRowColumnEnd = that.getGridRowColumn(parseInt(monthDayYearEnd[1]), todayModel.get("monthNames")[parseInt(monthDayYearEnd[0])-1]);
					var totweeks = eventRowColumnEnd[1]-eventRowColumnBegin[1]+1;
					//start updating availabilityGrid
					for(var i = 0; i < totweeks; i++){
						if(i == 0){
							if(eventRowColumnBegin[1] == eventRowColumnEnd[1]){
								if(availabilityGrid[(eventRowColumnBegin[1]-1)*7+eventRowColumnBegin[0]-1]["top"] == false){
									for(var y = (eventRowColumnBegin[1]-1)*7+eventRowColumnBegin[0]-1; y < (eventRowColumnEnd[1]-1)*7+eventRowColumnEnd[0]; y++){
										availabilityGrid[y]["top"] = true;
									}
								}
								else{
									if(availabilityGrid[(eventRowColumnBegin[1]-1)*7+eventRowColumnBegin[0]-1]["middle"] == false){
										for(var z = (eventRowColumnBegin[1]-1)*7+eventRowColumnBegin[0]-1; z < (eventRowColumnEnd[1]-1)*7+eventRowColumnEnd[0]; z++){
											availabilityGrid[z]["middle"] = true;
										}
									}
									else{
										if(availabilityGrid[(eventRowColumnBegin[1]-1)*7+eventRowColumnBegin[0]-1]["bottom"] == false){
											for(var aa = (eventRowColumnBegin[1]-1)*7+eventRowColumnBegin[0]-1; aa < (eventRowColumnEnd[1]-1)*7+eventRowColumnEnd[0]; aa++){
												availabilityGrid[aa]["bottom"] = true;
											}
										}
										else{
											for(var aa = (eventRowColumnBegin[1]-1)*7+eventRowColumnBegin[0]-1; aa < (eventRowColumnEnd[1]-1)*7+eventRowColumnEnd[0]; aa++){
												availabilityGrid[aa]["overflow"] = true;
											}
										}
									}
								}
							}
							else{
								if(availabilityGrid[(eventRowColumnBegin[1]-1)*7+eventRowColumnBegin[0]-1]["top"] == false){
									for(var y = (eventRowColumnBegin[1]-1)*7+eventRowColumnBegin[0]-1; y < eventRowColumnBegin[1]*7; y++){
										availabilityGrid[y]["top"] = true;
									}
								}
								else{
									if(availabilityGrid[(eventRowColumnBegin[1]-1)*7+eventRowColumnBegin[0]-1]["middle"] == false){
										for(var z = (eventRowColumnBegin[1]-1)*7+eventRowColumnBegin[0]-1; z < eventRowColumnBegin[1]*7; z++){
											availabilityGrid[z]["middle"] = true;
										}
									}
									else{
										if(availabilityGrid[(eventRowColumnBegin[1]-1)*7+eventRowColumnBegin[0]-1]["bottom"] == false){
											for(var aa = (eventRowColumnBegin[1]-1)*7+eventRowColumnBegin[0]-1; aa < eventRowColumnBegin[1]*7; aa++){
												availabilityGrid[aa]["bottom"] = true;
											}
										}
										else{
											for(var aa = (eventRowColumnBegin[1]-1)*7+eventRowColumnBegin[0]-1; aa < eventRowColumnBegin[1]*7; aa++){
												availabilityGrid[aa]["overflow"] = true;
											}
										}
									}
								}
							}
						}
						else if(i > 0 && i < totweeks-1){
							if(availabilityGrid[(eventRowColumnBegin[1]-1+i)*7]["top"] == false){
								for(var y = (eventRowColumnBegin[1]-1+i)*7; y < (eventRowColumnBegin[1]+i)*7; y++){
									availabilityGrid[y]["top"] = true;
									console.log("yolo");
								}
							}
							else{
								if(availabilityGrid[(eventRowColumnBegin[1]-1+i)*7]["middle"] == false){
									for(var z = (eventRowColumnBegin[1]-1+i)*7; z < (eventRowColumnBegin[1]+i)*7; z++){
										availabilityGrid[z]["middle"] = true;
										console.log("polo");
									}
								}
								else{
									if(availabilityGrid[(eventRowColumnBegin[1]-1+i)*7]["bottom"] == false){
										for(var aa = (eventRowColumnBegin[1]-1+i)*7; aa < (eventRowColumnBegin[1]+i); aa++){
											availabilityGrid[aa]["bottom"] = true;
										}
									}
									else{
										for(var aa = (eventRowColumnBegin[1]-1+i)*7; aa < (eventRowColumnBegin[1]+i); aa++){
											availabilityGrid[aa]["overflow"] = true;
										}
									}
								}
							}
						}
						else if(i == totweeks-1){
							if(availabilityGrid[(eventRowColumnEnd[1]-1)*7]["top"] == false){
								for(var y = (eventRowColumnEnd[1]-1)*7; y < (eventRowColumnEnd[1]-1)*7+eventRowColumnEnd[0]; y++){
									availabilityGrid[y]["top"] = true;
								}
							}
							else{
								if(availabilityGrid[(eventRowColumnEnd[1]-1)*7]["middle"] == false){
									for(var z = (eventRowColumnEnd[1]-1)*7; z < (eventRowColumnEnd[1]-1)*7+eventRowColumnEnd[0]; z++){
										availabilityGrid[z]["middle"] = true;
									}
								}
								else{
									if(availabilityGrid[(eventRowColumnEnd[1]-1)*7]["bottom"] == false){
										for(var aa = (eventRowColumnEnd[1]-1)*7; aa < (eventRowColumnEnd[1]-1)*7+eventRowColumnEnd[0]; aa++){
											availabilityGrid[aa]["bottom"] = true;
										}
									}
									else{
										for(var aa = (eventRowColumnEnd[1]-1)*7; aa < (eventRowColumnEnd[1]-1)*7+eventRowColumnEnd[0]; aa++){
											availabilityGrid[aa]["overflow"] = true;
										}
									}
								}
							}
						}
						else{
							console.log("error");
						}
					}
				});
			},
		});
		
	return CalendarMonthView;
	
});