//= require_self
//= require_tree ./templates
//= require_tree ./models
//= require_tree ./views
//= require_tree ./routers
//= require_tree ./collections

// include the CSRF token will every ajax call
$.ajaxSetup({
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
    }
});

(function () {
    window.Finances = {
        Models: {},
        Collections: {},
        Routers: {},
        Views: {},

        init: function(options) {
            // console.log("Initialization started");

            Finances.options = options;
//            new Finances.Routers.TransactionsRouter(options);
            this.Router = new Finances.Router();

            if (!Backbone.history.started) {
                Backbone.history.start();
                // Backbone.history.started = true;
            }

            // console.log("Finance app initialized ");
			
        }

    };

    
})();



