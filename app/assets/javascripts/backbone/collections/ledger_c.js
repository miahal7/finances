// js/collections/ledger.js

Finances.Collections = Finances.Collections || {};

Finances.Collections.Ledger = Backbone.Collection.extend({

  model: Finances.Models.Transaction,

  ledger_month: "",

  url: '/transactions/',

  initialize: function(models, options){
    var self = this;
    this.ledger_month = options.ledger_month;

    console.log("this.ledger_month -> " + options.ledger_month);

    this.fetch({data: {ledger_month: options.ledger_month}});



    // this.bankBalance = 0;
    // this.balance = 0;

    new Finances.Views.Ledger({collection: this}).render();
    // this.balancesView = new Finances.Views.Balances({collection: this});   
  }
});