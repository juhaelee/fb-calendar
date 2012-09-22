define(['underscore', 'backbone'], function(_, Backbone){
	var DateModel = Backbone.Model.extend({
		defaults: {
			currentDayMonth: null,
			currentDayWeek: null,
			currentMonth: null,
			currentYear: null,
			currentTodayMonth: null,
			dayNames: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
			dayNamesShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
			monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
			monthNamesShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
			totalDays: ["31","28","31","30","31","30","31","31","30","31","30","31"],
			startDays: null,
			totalWeeksPerMonth: null
		},
		initialize: function(){
			this.setToday();
			this.setYear();
		},
		setToday: function(){
			//today's date and time
			var date = new Date();
			
			//set day of the month
			this.set("currentDayMonth", date.getDate());
			
			//set day of the week
			var getDayNames = this.get("dayNames");
			this.set("currentDayWeek", getDayNames[date.getDay()]);
			
			//set month
			var getMonthNames = this.get("monthNames");
			this.set("currentMonth", getMonthNames[date.getMonth()]);
			this.set("currentTodayMonth", getMonthNames[date.getMonth()]);
			
			//set year
			this.set("currentYear", date.getFullYear());
		},
		decreaseMonth: function(){
			var getMonthList = this.get('monthNames');
			var thisMonth = getMonthList.indexOf(this.get('currentMonth'));
			if(thisMonth === 0){
				this.set('currentMonth', 'December');
				this.set('currentYear', this.get('currentYear')-1);
			}
			else{
				this.set('currentMonth', getMonthList[thisMonth-1]);
			}
		},
		increaseMonth: function(){
			var getMonthList = this.get('monthNames');
			var thisMonth = getMonthList.indexOf(this.get('currentMonth'));
			if(thisMonth === 11){
				this.set('currentMonth', 'January');
				this.set('currentYear', this.get('currentYear')+1);
			}
			else{
				this.set('currentMonth', getMonthList[thisMonth+1]);
			}
		},
		setYear: function(){
			//set total days
			if ((this.get("currentYear")%100!=0) && (this.get("currentYear")%4==0) || (this.get("currentYear")%400==0)){  
				var totalDays = ["31", "29","31","30","31","30","31","31","30","31","30","31"];
				this.set("totalDays", totalDays);
			}
			//set 1st day of each month
			var tempArray = [];
			for(var x = 0; x < 12; x++) {
				var tempDate = new Date(this.get("monthNames")[x] + ' 1,' + this.get("currentYear"));
				tempArray.push(this.get("dayNames")[tempDate.getDay()]);
			}
			this.set("startDays", tempArray);
			
			//set number of weeks to show per month
			tempArray = [];
			for(var i = 0; i < 12; i++){
				for(var j = 0; j < this.get("dayNames").length; j++){
					if(this.get("dayNames")[j] === this.get("startDays")[i]){
						if(j === 0){
							tempArray.push(Math.ceil(this.get("totalDays")[i]/7));
						}
						else {
							tempArray.push(Math.ceil((parseInt(this.get("totalDays")[i])+j)/7));
						}
					}
				}
			}
			this.set("totalWeeksPerMonth", tempArray);
		}
	});
	
	return new DateModel();
});