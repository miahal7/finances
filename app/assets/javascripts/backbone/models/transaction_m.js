// models/transaction_m.js

Finances.Models = Finances.Models || {}; // initialize our models namespace if it has not been done already

Finances.Models.Transaction = Backbone.Model.extend({

    urlRoot: "/transactions",	   

    initialize: function(){
    	this.now = moment().format("MM/DD/YYYY");
    	return this;
    },

    defaults: {
		date: this.now,
		amount: '',
		cleared: false,
		deposit: false,
		recurring: false,
		ledger_month: "05/01/2013",
		vendor: {name: ''},
		category: {name: ''}		
	}
});