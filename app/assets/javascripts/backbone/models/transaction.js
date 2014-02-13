// models/mymodel.js

Finances.Models = Finances.Models || {}; // initialize our models namespace if it has not been done already

// My Model

Finances.Models.Transaction = Backbone.Model.extend({
    defaults: {
        date: null,
        amount: null,
        cleared: null,
        recurring: null,
        ledger_month: null,
        deposit: null
    },
	
    urlRoot: "/transactions/",

    initialize: function () {
        console.log("My Transactions Model Initialized!");
    },

    parse: function (response) {
//        $("#modal").html(new App.Views.MessagePopup({model: response}).render().el);

        // console.log("Finances.Models.MyModel.parse -> JSON: " + JSON.stringify(response));
        return response;
    }

});