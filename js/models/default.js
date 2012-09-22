define(['underscore', 'backbone'], function(_, Backbone){
	var DefaultModel = Backbone.Model.extend({
		defaults: {
			calendarOption: null,
			calendarType: "month"
		},
		initialize: function(){
		},
		setCalendarOption: function(opt){
			if(opt !== this.get("calendarOption")){
				this.set("calendarOption", opt);
				$(opt).addClass("selected");
			}
			else {
				this.set("calendarOption", null);
				$(opt).removeClass("selected");
			}
		}
	});
	
	return new DefaultModel();
});