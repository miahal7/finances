// views/transaction.js

Finances.Views = Finances.Views || {};

Finances.Views.Transaction = Backbone.View.extend({
 
    el: '#ledger',
	
	initialize: function(){		
		_.bindAll(this);
		this.template = JST["backbone/templates/transaction_t"];	
		this.render();
	},

	render: function(){
		var self = this;		
		
		// var t1 = new Finances.Models.Transaction();
		var ledger = new Finances.Collections.Ledger();
		
		ledger.fetch({
			success: function(l){
				console.log("ledger2 ->" + JSON.stringify(l))
				l.render
			}
		});
		// console.log("ledger -> " + JSON.stringify(ledger));
		// t1.fetch({
	// 		success: function(transactions){
	// 			var t = transactions.attributes;
	// 			console.log(transactions);
	// 			$.each(transactions, function(trans) {				
	// 				ledger.add(trans);
	// 
	// 				console.log(JSON.stringify(ledger.models));					
	// 
	// 			});
	// 		}
	// 	});

        return this;		
	}
});
