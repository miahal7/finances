// views/transaction.js

Finances.Views = Finances.Views || {};

Finances.Views.Transaction = Backbone.View.extend({

	el: "#ledger-tbody",
	
	initialize: function(){		
		this.template = JST["backbone/templates/transaction_t"];
		this.collection.total += this.model.toJSON().amount;	
	},	

	render: function(){
		this.$el.append(this.template({model: this.model.toJSON()}));
		return this;
	}
});
