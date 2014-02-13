// views/ledger.js

Finances.Views.Ledger = Backbone.View.extend({
	el: "#ledger",
	
	initialize: function(transactions){
		_.bindAll(this); // underscore event wiring
		this.template = JST["backbone/templates/ledger"]; // set the template to be used
		this.render();
		// Finances.LedgerCollection = new Finances.Collections.Ledger();
	},
	
	render: function(){
		$(this.el).html("CHANGED!");
		// var ledger = Finances.Collections.Ledger.fetch();
		console.log("Rendering Ledger");
		
		//Finances.LedgerCollection.each(function(item){
// 			this.renderTransaction(item);
// 		}, this);

		return this;
	},
	
	renderTransaction: function(item){
		var transactionView = new Finances.Views.Transaction({
			model: item
		});
		
		
		// <tr>
	// 		<td style="margin: 3px; border: 1px solid grey;"><%= id %></td>
	// 		<td style="margin: 3px; border: 1px solid grey;"><%= date %></td>
	// 		<td style="margin: 3px; border: 1px solid grey;"><%= amount %></td>
	// 		<td style="margin: 3px; border: 1px solid grey;"><%= cleared %></td>
	// 		<td style="margin: 3px; border: 1px solid grey;"><%= recurring %></td>
	// 		<td style="margin: 3px; border: 1px solid grey;"><%= deposit %></td>
	// 		<td style="margin: 3px; border: 1px solid grey;"><%= ledger_month %></td>
	// 	</tr>
		
		
		
		this.$el.append(transactionView.render().el);
	}
});