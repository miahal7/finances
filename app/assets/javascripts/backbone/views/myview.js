// views/myview.js

Finances.Views = Finances.Views || {};

Finances.Views.MyView = Backbone.View.extend({
 
	el: '#app-content', // target HTML DOM element

	initialize: function(){
		_.bindAll(this); // underscore event wiring
		this.template = JST["backbone/templates/myview"]; // set the template to be used
        console.log("My View Initialized with " + this.template);
        this.render(); // go ahead and render our view
	},

	render: function(){
		// render the template with data to the target HTML DOM element
		
		// put loading icon or message here...
		$(this.el).html("Loading meh shat!");

		this.model.fetch({
			success: function(model, response){
				console.log("response: " + JSON.stringify(response));
				$(this.el).html(this.template(this.model.toJSON())); // use call toJSON only on bb models
			},
			error: function(message){
				console.log("message: " + message);
			}
		});
		console.log("My View Rendered!");
		return this;
	}
});