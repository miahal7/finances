// models/balance.js

Finances.Models = Finances.Models || {}; // initialize our models namespace if it has not been done already

Finances.Models.Balance = Backbone.Model.extend({

    urlRoot: "/transactions/balance",    
    
    defaults: {  
      amount: 0    
    },

    initialize: function (options) {  
      var self = this;
      // this.ledger = options.ledger; 

      // this.listenTo(this.ledger, 'add', this.addRow);
      // this.listenTo(this.ledger, 'add', this.letotal);
        
      this.fetch({data: {ledger_month: options.ledger_month},        
        success: function(model, response){
          self.amount = response.amount;
          self.view = new Finances.Views.Balance({model: response.amount})
          self.view.render();   
        }
      }); 


      return this;
    }

});