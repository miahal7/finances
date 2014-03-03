// views/ledger.js

Finances.Views.Ledger = Backbone.View.extend({
	el: "#ledger",
	
	events: {
		//'click .vendor': "initVendorTypeAhead",
		'change .model': "saveTransaction"
	},
	
	initialize: function(transactions){
		var self = this;
		
		_.bindAll(this); // underscore event wiring
		this.on('save', this.render, this);

		this.template = JST["backbone/templates/ledger_t"]; // set the template to be used
		this.collection = new Finances.Collections.Ledger();
		this.collection.fetch().done(function(){
			self.render();			
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
	
	saveTransaction: function(e){
		var tr = $(e.currentTarget);
		var id = $(tr).attr("data-model-id");
		var vendorName = tr.find(".vendor").find("input").val();
		var categoryName = tr.find(".category").find("input").val();
		var amount = tr.find(".amount").find("input").val();
		var date = tr.find(".trans-date").find("input").val();
	    var cleared = tr.find(".cleared").find("input").is(":checked");
	    var recurring = tr.find(".recurring").find("input").is(":checked");
	    var deposit = tr.find(".deposit").find("input").is(":checked");		
		
		// console.log("vendor: " +  vendor + ", category: " +  category + ", amount: " +  amount + ", date: " +  date + ",	cleared: " +  cleared + ", recurring: " +  recurring + ", deposit: " +  deposit);
		
		var transaction = new Finances.Models.Transaction(this.collection.get(id).toJSON());
		var trans_params = transaction;
		var vendor = transaction.toJSON().vendor;
		var category = transaction.toJSON().category;
		//console.log("transaction -> " + transaction.toJSON().vendor.id);
		 
		transaction.set({vendor: {id: vendor.id, name: vendorName, created_at: vendor.created_at, updated_at: vendor.updated_at},
		 				 category: {id: category.id, name: categoryName, created_at: category.created_at, updated_at: category.updated_at},
					  	 amount: parseFloat(amount),
					     date: date,
					     cleared: cleared,
					     recurring: recurring,
					     deposit: deposit});
		
		// console.log(transaction.changed);
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
















