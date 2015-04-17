// views/ledger.js

Finances.Views.Balance = Backbone.View.extend({
	el: "#ledger-totals",
	
	events: {
		"change input.deposit, input.cleared" : "testFunction"
	},

	initialize: function(options){
		this.template = JST["backbone/templates/balances"]; 
		this.balance = this.model || 0; 

		return this;
	},

	render: function(){
		this.$el.html(this.template({ balance: this.balance }));

		return this;	
	},
});