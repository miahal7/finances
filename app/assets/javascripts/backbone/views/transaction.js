// views/transaction.js

Finances.Views = Finances.Views || {};

Finances.Views.Transaction = Backbone.View.extend({
 
	el: '#app-content', // target HTML DOM element

	initialize: function(){
		_.bindAll(this); // underscore event wiring
		this.template = JST["backbone/templates/transaction"]; // set the template to be used
        console.log("Transaction View Initialized");
        //this.render(); // go ahead and render our view
	},

	render: function(){
		var self = this;

		// render the template with data to the target HTML DOM element

		$(self.el).html("Loading Transactions");

		this.model.fetch({
			success: function(model, response){
//				console.log("response: " + JSON.stringify(response));
				if(response.length !== 0){
					console.log("RESPONSE GOING TO TEMPLATE -> " + response[0]);
					$(self.el).html(self.template(response[0]));
				}
				else{
					$(self.el).html("...No Transactions");
				}
				
				// $(self.el).html(self.template(self.model.toJSON())); // use call toJSON only on bb models
			},
			error: function(message){
				console.log("message: " + message);
				$(self.el).html("ERROR: " + message);
			}
		});
		console.log("Transaction View Rendered!");
		return this;
	}
});