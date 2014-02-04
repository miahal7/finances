// models/mymodel.js

Finances.Models = Finances.Models || {}; // initialize our models namespace if it has not been done already

// My Model

Finances.Models.Transaction = Backbone.Model.extend({

    urlRoot: "/transactions/",

    initialize: function(){
        console.log("My Transactions Model Initialized!");
    },

    parse: function(response){
        console.log("Finances.Models.MyModel.parse -> JSON: " + JSON.stringify(response));
        return response;
    }

});