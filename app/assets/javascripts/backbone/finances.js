// require_self
// require_tree ./templates
// require_tree ./models
// require_tree ./views
// require_tree ./routers
// require_tree ./collections

// include the CSRF token will every ajax call
// $.ajaxSetup({
//     beforeSend: function(xhr)
//     {
//       xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
//     }
// });

(function () {
    window.Finances = {
        Models: {},
        Collections: {},
        Routers: {},
        Views: {},

        init: function(options) {
            console.log("Initialization started");

            Finances.options = options;
//            new Finances.Routers.TransactionsRouter(options);
            this.Router = new Finances.Router();

            if (!Backbone.history.started) {
                Backbone.history.start();
                // Backbone.history.started = true;
            }

            console.log("Finance app initialized ");
			
        }

    };

    
})();




Finances.Router = Backbone.Router.extend({

    routes: {

        "": "index"

        // "my_route": "loadMyRoute"

    },

    initialize: function () {
        console.log("App Initialized!");
    },

    index: function () {
        new Finances.Views.Ledger();
        console.log("index Route Loaded!");
    }

    // loadMyRoute: function () {
    //     // a few examples of how to create a model
    //     // straight JSON
    //     // var myModel = {name: "Barack Obama", phone: "432-638-9999"};

    //     // bb model with no preset data
    //     // var myModel = new App.Models.MyModel();
    //     // myModel.fetch(); // call remote web service and load data into the model

    //     // bb model with preset data
    //     // var myModel = new App.Models.MyModel({name: "Barack Obama", phone: "432-638-9999"});

    //     // "el" or target HTML DOM element is used to target an area on the page
    //     // "model" is the BB model or straight JSON
    //     // new App.Views.MyView({el: "#app-content", model: myModel});

    //     // no target, inline model
    //     // the target is usually set in the view file itself under "el"
    //     new Finances.Views.MyView({model: new Finances.Models.Transaction({name: "Barack Obama", phone: "432-638-9999"})});

    //     console.log("otherRoute Route Loaded!");
    // }

});