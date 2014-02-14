// views/ledger.js

Finances.Views.Ledger = Backbone.View.extend({
	el: "#ledger",
	
	initialize: function(transactions){
		var self = this;
		
		_.bindAll(this); // underscore event wiring
		this.template = JST["backbone/templates/ledger_t"]; // set the template to be used
		this.collection = new Finances.Collections.Ledger();
		this.collection.fetch().done(function(){
			self.render();			
		});
		// Finances.LedgerCollection = new Finances.Collections.Ledger();
	},
	
	render: function(){
		console.log("collection -> " + JSON.stringify(this.collection));
		this.$el.html(this.template({
		    collection: this.collection.toJSON()
		}));
		
		
		// var self = this;
// 			$(this.el).html(this.template);
// 	
// 				this.collection.each(function(item){
// 					
// 				self.renderTransaction(item);
// 			});
// 
// 		this.$el.append("</table>");

		return this;
	},
	
	renderTransaction: function(item){
		// console.log("Rendering Transaction (renderTransaction) -> " + item);
	
		var transactionView = new Finances.Views.Transaction({
			model: item
		});
		this.$el.append(transactionView.render());
		
		// <tr>
	// 		<td style="margin: 3px; border: 1px solid grey;"><%= id %></td>
	// 		<td style="margin: 3px; border: 1px solid grey;"><%= date %></td>
	// 		<td style="margin: 3px; border: 1px solid grey;"><%= amount %></td>
	// 		<td style="margin: 3px; border: 1px solid grey;"><%= cleared %></td>
	// 		<td style="margin: 3px; border: 1px solid grey;"><%= recurring %></td>
	// 		<td style="margin: 3px; border: 1px solid grey;"><%= deposit %></td>
	// 		<td style="margin: 3px; border: 1px solid grey;"><%= ledger_month %></td>
	// 	</tr>
		
	// console.log("transactionView.model -> " + JSON.stringify(transactionView.model));
		
		// this.$el.append(transactionView.render(transactionView.model).el);
	}
});