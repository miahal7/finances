// models/transaction_m.js

Finances.Models = Finances.Models || {}; // initialize our models namespace if it has not been done already

Finances.Models.Transaction = Backbone.Model.extend({

    urlRoot: "/transactions",	   
    
    defaults: {
		date: this.now,
		amount: '',
		cleared: false,
		deposit: false,
		recurring: false,
		ledger_month: "12/01/2014",
		vendor: {name: ''},
		category: {name: ''}
	},

    initialize: function () {
    	this.now = moment().format("MM/DD/YYYY");
		
    	return this;
    },

    save: function (attributes, options) {
      console.log("transaction -> " + JSON.stringify(this));

      console.log("Saving Transaction");
      Backbone.Model.prototype.save.call(this, attributes, options);

 

      // this.save();
    }
});