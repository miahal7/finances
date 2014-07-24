// views/ledger.js

Finances.Views.Totals = Backbone.View.extend({
	el: "#ledger-totals",
	
	events: {
		"change .amount > input": "formatAmount"
	},
	
	initialize: function(){
		this.template = JST["backbone/templates/totals"]; 

		// this.listenTo(this.collection, 'add', this.total);
		this.render();
		return this;
	},

	render: function(){
		// this.calculateTotal();


		this.$el.html(this.template({total: this.collection.total}));
		/* Adds a row for each model in the collection */
		// this.collection.forEach(this.addRow, this);
				
		return this;
	}

	// calculateTotal: function(){
	// 	this.collection.each(function(transaction){
	// 		console.log("transaction amount-> "  + transaction.toJSON().amount);
	// 	});
	// }

});
















