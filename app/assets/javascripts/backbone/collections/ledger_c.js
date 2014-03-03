// js/collections/ledger.js

Finances.Collections = Finances.Collections || {}; // initialize our collections namespace if it has not been done already

Finances.Collections.Ledger = Backbone.Collection.extend({

    model: Finances.Models.Transaction,

    url: '/transactions/'
});

