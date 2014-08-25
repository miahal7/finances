// views/ledger.js

Finances.Views.Balances = Backbone.View.extend({
	el: "#ledger-totals",
	
	initialize: function(){
		this.template = JST["backbone/templates/balances"]; 

		this.render();
		return this;
	},

	render: function(){
		this.$el.html(this.template({balance: this.collection.balance, bankBalance: this.collection.bankBalance}));
				
		return this;
	}
});