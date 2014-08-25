// js/collections/ledger.js

Finances.Collections = Finances.Collections || {};

Finances.Collections.Ledger = Backbone.Collection.extend({

  model: Finances.Models.Transaction,

  url: '/transactions/',

  initialize: function(){
    var self = this;
    this.fetch();

    this.bankBalance = 0;
    this.balance = 0;

    new Finances.Views.Ledger({collection: this}).render();
    this.balancesView = new Finances.Views.Balances({collection: this});   
  }
});