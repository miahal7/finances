// models/balance.js

Finances.Models = Finances.Models || {}; // initialize our models namespace if it has not been done already

Finances.Models.Balance = Backbone.Model.extend({

    urlRoot: "/transactions/balance",    
    
    // defaults: {  
    //   amount: 0    
    // },

    initialize: function (options) {  
      this.fetch({
        data: {ledger_month: options.ledger_month},
        success: function(collection, response, options){
          // console.log("response -> " + response)
        }
      });
      
      // this.fetch({ data: { ledger_month: options.ledger_month } });

      console.log("this -> " + JSON.stringify(this));


      return this.amount;
    }    
});