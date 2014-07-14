// js/collections/ledger.js

Finances.Collections = Finances.Collections || {}; // initialize our collections namespace if it has not been done already

Finances.Collections.Ledger = Backbone.Collection.extend({

    model: Finances.Models.Transaction,

    url: '/transactions/',

    initialize: function(){
  //   	var ledger = this.fetch({
		// 	success: function(model, response){
		// 		// console.log("");
		// 	},
		// 	error: function(model, response){
		// 		console.log("There was a problem retrieving the transaction collection");
		// 	}
		// });
		this.fetch();
		// console.log("init 1");
		this.total = 0;
    	var foo = new Finances.Views.Ledger({collection: this}).render();
    	// console.log("init 2");
    }
});

