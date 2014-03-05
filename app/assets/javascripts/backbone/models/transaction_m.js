// models/mymodel.js

Finances.Models = Finances.Models || {}; // initialize our models namespace if it has not been done already

// My Model

Finances.Models.Transaction = Backbone.Model.extend({
    // urlRoot: "/transactions"
	
	
	url: function() {
      var base =  '/transactions/';
      if (this.isNew()){
		 console.log("model is new, saving to db as new transaction");
      	 return base;
      }
      else{
 		// console.log("model already exists, updating transaction");		  
		 return base + this.id;
	  }
    },
	defaults: {
		date: '',
		amount: '',
		cleared: false,
		deposit: false,
		recurring: false,
		ledger_month: '',
		vendor: {name: ''},
		category: {name: ''}		
	}
	
	
	

   // initialize: function () {
// 		_.bindAll(this); // underscore event wiring
// 		
//         console.log("My Transactions Model Initialized!");
		// return this.fetch();
    // }
// 
		//     parse: function (response) {
		// var ary = Array();
		// 
		// $.each(response, function(index, value){
		//             // console.log("response.attributes " + JSON.stringify(value));
		// 	ary.push(value);
		// });
		// 
		//         return ary;
		//     }

});