//Finances.Routers.TransactionsRouter = Backbone.Router.extend({
//    initialize: function (options) {
//        console.log("initializing transactions router");
//        transactions = new Finances.Collections.TransactionsCollection();
//        transactions.reset;
//        options.transactions;
//    },
//    routes: {
//        "new": "newTransaction",
//        "index": "index",
//        ":id/edit": "edit",
//        ":id": "show",
//        ".*": "index"
//    },
//    newTransaction: function (transaction) {
//        console.log("in transactions new route");
//        new Finances.Views.Transactions.NewView({model: new Finances.Models.Transaction({name: "Barack Obama", phone: "432-638-9999"})});
//    },
//    index: function () {
//        console.log("in transactions index route");
////        @view = new Finances.Views.Transactions.IndexView(transactions
////        :
////        @transactions
////        )
////        ;
////        $("#transactions").html(@view.render().el);
//    },
//    show: function (id) {
//        console.log("in transactions show route");
////        transaction = @transactions.get(id);
////
////        @view = new Finances.Views.Transactions.ShowView(model
////        :
////        transaction
////        )
////        ;
////        $("#transactions").html(@view.render().el);
//    },
//    edit: function (id) {
//        console.log("in transactions index route");
////        transaction = @transactions.get(id);
////
////        @view = new Finances.Views.Transactions.EditView(model
////        :
////        transaction
////        )
////        ;
////        $("#transactions").html(@view.render().el);
//    }
//});