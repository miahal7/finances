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




function init_vendor_ta(){
	console.log("INIT VENDOR TA")
	
	var vendors = new Bloodhound({ 
		name: 'vendors',
		prefetch: {
			url: "/vendors/names",
			ttl: 1
		},
		limit: 10,
	    remote: '/vendors/named_like?name=%QUERY',
	
		dupDetector: function(remote, local){
			var duplicate = false;
			if(remote.name == local.name){
				duplicate = true;
			}				
			return duplicate;
		},
	    datumTokenizer: function(d) { 
			//console.log(d)
	        return Bloodhound.tokenizers.whitespace(d.name); 
	    },
	    queryTokenizer: Bloodhound.tokenizers.whitespace
	});

	vendors.initialize();
	
	$('.vendor-typeahead, .typeahead').typeahead(
		{
			minLength: 1,
	    	highlight: true,
		},
		{
		  displayKey: 'name',
		  source: vendors.ttAdapter()
	});
}
// var categories = new Bloodhound({ 
// 	name: 'categories',
// 	prefetch: {
// 		url: "/categories/names",
// 		ttl: 1
// 	},
// 	limit: 10,
//     remote: '/categories/named_like?name=%QUERY',
// 	
// 	dupDetector: function(remote, local){
// 		var duplicate = false;
// 		if(remote.name == local.name){
// 			duplicate = true;
// 		}				
// 		return duplicate;
// 	},
//     datumTokenizer: function(d) { 
//         return Bloodhound.tokenizers.whitespace(d.name); 
//     },
//     queryTokenizer: Bloodhound.tokenizers.whitespace
// });

// categories.initialize();



// $('.category-typeahead').typeahead(
// 	{
// 		minLength: 1,
//     	highlight: true,
// 	},
// 	{
// 	  displayKey: 'name',
// 	  source: categories.ttAdapter()
// });