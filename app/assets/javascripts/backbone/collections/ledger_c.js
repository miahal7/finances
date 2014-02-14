// js/collections/ledger.js

Finances.Collections = Finances.Collections || {}; // initialize our collections namespace if it has not been done already

Finances.Collections.Ledger = Backbone.Collection.extend({

    model: Finances.Models.Transaction,

    url: '/transactions/',

    // remote: true,

    initialize: function () {
        // console.log("Ledger Collection Initialized!");
    },

    parse: function (response) {
        // console.log("Finances.Collecions.Transactions.parse -> JSON: " + JSON.stringify(response));
        return response;
    }
});

