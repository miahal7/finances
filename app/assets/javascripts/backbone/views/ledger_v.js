// views/ledger.js

Finances.Views.Ledger = Backbone.View.extend({
	el: "#ledger",
	
	events: {
		'click #new-transaction': "addTransaction",
		'change .editable': "saveTransaction",
		'click .delete': "deleteTransaction",
		'typeahead:selected .vendor-typeahead' : 'saveTransaction'
		//'click .vendor-typeahead': 'initVendorTypeahead'
	},
	
	initialize: function(transactions){
		var self = this;
		
		_.bindAll(this); // underscore event wiring
		this.on('save', this.render, this);

		this.template = JST["backbone/templates/ledger_t"]; // set the template to be used
		this.collection = new Finances.Collections.Ledger();
		this.collection.fetch().done(function(){
			self.render();	
			
			console.log("render complete");	
			
			self.vendorTypeaheadInit();	
		});
		
		
		// Finances.LedgerCollection = new Finances.Collections.Ledger();
	},
	
	render: function(){
		
		this.template = JST["backbone/templates/ledger_t"]; // set the template to be used
		
		// console.log("collection -> " + JSON.stringify(this.collection));
		this.$el.html(this.template({
		    collection: this.collection.toJSON()
		}));
		
				
		return this;
	},
	
	deleteTransaction: function(e){
		
		var tr = $(e.currentTarget).closest("tr");
		var id = $(tr).attr("data-model-id");
		
		var transaction = new Finances.Models.Transaction(this.collection.get(id).toJSON());
		this.collection.remove(transaction);
		console.log("Removing " + transaction);
		this.render();
		transaction.destroy();
	},
	
	addTransaction: function(e){
		var self = this;

		var transaction = new Finances.Models.Transaction({vendor: {name: ""},
		 					 							   category: {name: ""},
													   	   amount: 0,
													       date: "",
													       cleared: false,
													       recurring: false,
													       deposit: false,
													   	   ledger_month: "2013-05-01"});
														   
		transaction.save({}, {
			success: function(response){
				self.collection.add(response);
				self.render();								
			}
		});		
	},
	vendorTypeaheadInit: function(){
		console.log("INIT VENDOR TA")
		var self = this;
		
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
	
		$('.vendor-typeahead').typeahead(
			{
				minLength: 1,
		    	highlight: true,
  		
			},
			{
			  displayKey: 'name',
			  source: vendors.ttAdapter()
			
		});
		
		// $('.vendor-typeahead').bind('typeahead:selected', function(obj, datum, name) { 
		// 	console.log("Works");
		// 	self.saveTransaction();
		//       		$(this).blur();     
		// });
	},

	saveTransaction: function(e){
		console.log("I guess something has changed..." );
		
		
		var tr = $(e.currentTarget).closest("tr");
		var id = $(tr).attr("data-model-id");
		var vendorName = $(e.currentTarget).closest(".vendor-typeahead").typeahead('val');
		var categoryName = tr.find(".category").find("input").val();
		var amount = tr.find(".amount").find("input").val();
		var date = tr.find(".trans-date").find("input").val();
	    var cleared = tr.find(".cleared").find("input").is(":checked");
	    var recurring = tr.find(".recurring").find("input").is(":checked");
	    var deposit = tr.find(".deposit").find("input").is(":checked");		
		
		console.log("vendor: " +  vendorName + ", category: " +  categoryName + ", amount: " +  amount + ", date: " +  date + ",	cleared: " +  cleared + ", recurring: " +  recurring + ", deposit: " +  deposit);
		
		var transaction = new Finances.Models.Transaction(this.collection.get(id).toJSON());
		var trans_params = transaction;
		var vendor = transaction.toJSON().vendor;
		var category = transaction.toJSON().category;
		// console.log("transaction -> " + JSON.stringify(transaction));
		 
		transaction.set({vendor: {name: vendorName},
		 				 category: {name: categoryName},
					  	 amount: parseFloat(amount),
					     date: date,
					     cleared: cleared,
					     recurring: recurring,
					     deposit: deposit});
		
		console.log("transaction -> " + JSON.stringify(transaction));
		transaction.save();
		
	},
	
	renderTransaction: function(item){
		var transactionView = new Finances.Views.Transaction({
			model: item
		});
		
		this.$el.append(transactionView.render());
	},
	
	initVendorTypeAhead: function(e){
		// var id = $(e.currentTarget).parent().attr("data-id");
		
		// var transaction = this.collection.get(id);
				 
		// var transaction = new Finances.Models.Transaction({
		// 	model: item
		// });
		
		// console.log("transaction before " + JSON.stringify(transaction));
		
		// transaction.set();
		// transaction.save({amount: 55.55});
		// console.log("transaction after " + JSON.stringify(transaction.toJSON()));
		
		// this.reset();
		// transaction.render();
		//console.log("Transaction -> " + JSON.stringify(transaction));
	}
});
















