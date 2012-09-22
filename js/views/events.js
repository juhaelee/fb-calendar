define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/events.html',
	], function($, _, Backbone, eventTemplate){
		var EventView = Backbone.View.extend({
			tagName: "td",
			template: _.template(eventTemplate),
			events: {
			},
			initialize: function(){
				this.model.on('change', this.render, this);
			},
			render: function(x, totdays, numcols, pos){
				$(this.el).html(this.template(this.model.toJSON()));
				this.$el.attr("rowspan", 1);
				if(totdays > 1){
					this.$el.attr("colspan", totdays);
					if(pos == 1){
						for(var y = 0; y < totdays-1; y++){
							$("#eventsTable").find(".month-row").eq(x[1]-1).find(".grid").find("tr").eq(pos).find("td").eq(x[0]-1-numcols).next().remove();
						}
					}
				}
				else{
					if(pos = 1 && numcols == 0){
						$("#eventsTable").find(".month-row").eq(x[1]-1).find(".grid").find("tr").eq(2).append('<td rowspan="2"></td>');
					}
				}
				return this;
			},
			attributes:{"rowspan": 1},
			
		});
		
	return EventView;
		
});