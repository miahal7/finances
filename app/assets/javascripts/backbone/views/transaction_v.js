// views/transaction.js

Finances.Views = Finances.Views || {};

Finances.Views.Transaction = Backbone.View.extend({
 
	el: '#ledger-tbody', // target HTML DOM element

	initialize: function(){
		_.bindAll(this); // underscore event wiring
		this.template = JST["backbone/templates/transaction_t"]; // set the template to be used
        // console.log("Transaction View Initialized");
        //this.render(); // go ahead and render our view
	},

	render: function(){
		// var self = this;
		console.log(this.el)
		// console.log(this.el);
		// render the template with data to the target HTML DOM element
		$(this.el).append(this.template(this.model.toJSON()));
		// $(self.el).html("Loading Transactions");

		// this.model.fetch({
// 			success: function(model, response){
// //				console.log("response: " + JSON.stringify(response));
// 				if(response.length !== 0){
// 					// console.log("RESPONSE GOING TO TEMPLATE -> " + response);
// 					// $(self.el).html(self.template(item.toJSON()));
// 					// console.log(self.template(response));
// 					$(self.el).html(self.template(response));
// 				}
// 				else{
// 					$(self.el).html("...No Transactions");
// 				}
// 				
// 				// $(self.el).html(self.template(self.model.toJSON())); // use call toJSON only on bb models
// 			},
// 			error: function(message){
// 				console.log("message: " + message);
// 				$(self.el).html("ERROR: " + message);
// 			}
// 		});
		// console.log("Transaction View Rendered!");
		return this;
	}
});