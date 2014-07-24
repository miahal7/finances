// views/ledger.js

Finances.Views.Ledger = Backbone.View.extend({
	el: "#ledger",
	
	events: {
		'click #new-transaction': "addTransaction",
		'change .editable': "saveTransaction",
		'click .delete': "deleteTransaction",
		"focus [data-behaviour~=datepicker]": "datepickerInit",
		'click .vendor > input': 'typeaheadInit',
		'click .category > input': 'typeaheadInit',
		"change .amount > input": "formatAmount",
		"change .deposit > input" : "updateTotal"

		// 'typeahead:selected .vendor-typeahead' : 'saveTransaction',
		// 'typeahead:selected .category-typeahead' : 'saveTransaction'
	},

	saveTransaction: function(ev){
		var transaction = this.transactionFromEvent(ev);

		// transaction.save();

	},

	initialize: function(){
		this.template = JST["backbone/templates/ledger_t"]; 
		/* Watch collection for an added model. If one is added, add a row. */
		this.listenTo(this.collection, 'add', this.addRow);
		this.listenTo(this.collection, 'add', this.total);
		return this;
	},

	render: function(){
		this.$el.html(this.template());
		// new Finances.Views.Totals({ collection: this.collection });

		/* Adds a row for each model in the collection */
		// this.collection.forEach(this.addRow, this);
				
		return this;
	},

	/* Adds an individual row to the ledger table */
	addRow: function(transaction){
		var transactionView = new Finances.Views.Transaction({
			model: transaction,
			collection: this.collection
		});
		transactionView.render();

		// console.log("total -> " + this.collection.total);
	},
	
	deleteTransaction: function(e){
		var tr = $(e.currentTarget).closest("tr");
		var id = $(tr).attr("data-model-id");
		var transaction = this.collection.get(id);

		tr.remove();
		transaction.destroy();
	},
	
	/* Adds a transaction to the ledger collection */
	addTransaction: function(e){
		var rand = 99999 + Math.floor(Math.random() * 999999);

		this.collection.add(new Finances.Models.Transaction({tempId: rand}));
		//persistence 
	},

	typeaheadInit: function(ev){
		var self = this;
		var type = $(ev.target).data('type');
		var hasTypeahead = $(ev.target).hasClass("ta");
		var url = "/" + type + "/names";
		var remote = "/" + type + "/named_like?name=%QUERY";
		var ta = {};		

		if(!hasTypeahead){
			ta = new Bloodhound({ 
				name: type,
				prefetch: { url: url, ttl: 1 },
				limit: 10,
				remote: remote,

				dupDetector: function(remote, local){
					var duplicate = (remote.name === local.name)? true : false;							
					return duplicate;
				},

				datumTokenizer: function(d) { 
					return Bloodhound.tokenizers.whitespace(d.name); 
				},
				queryTokenizer: Bloodhound.tokenizers.whitespace
			});

			ta.initialize();

			$(ev.target).typeahead(
				{ minLength: 1,	highlight: true }, 
				{ displayKey: 'name', source: ta.ttAdapter()})
			.addClass("ta");
		}

		$(ev.target).focus();
	},

	datepickerInit: function(ev){
		var datePicker = $(ev.target);
		var self = this;

	    /*Checking if the datepicker has the datepicker class prevents the datepicker
	    object from instantiating multiple times for each input */
	    if(!datePicker.hasClass("datepicker")){
		    datePicker.datepicker({
		    		format: "mm/dd/yyyy",
		    		todayBtn: "linked",
		    		forceParse: true,
		    		autoclose: true,
		    		todayHighlight: true,
		    		language: "en",
		    		orientation: "right"
		    	}).on("change", function(e){
		    		self.validateDate(datePicker);
		    	});
		    
	    	datePicker.addClass("datepicker");
	    }

	},

	validateDate: function(datePicker){
		var date = datePicker.val();
		var isDate = this.isDate(date);

	    /*The default behavior of the datepicker is to make the input field blank when the same date as
	    what is already in the text field is selected. To get around this, whenever the date becomes blank,
	    revert the date back to the last valid selected date by saving the last valid date in data-date.*/
	    if(!isDate){
	    	datePicker.val(datePicker.data("date"));
	    }
	    else{
	    	datePicker.data("date", date);
	    }
	},

	isDate: function (txtDate) {
		var currVal = txtDate;
		if(currVal == '')
			return false;

	    //Declare Regex
	    var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
	    var dtArray = currVal.match(rxDatePattern); // is format OK?

	    if (dtArray == null)
	    	return false;

	    //Checks for mm/dd/yyyy format.
	    dtMonth = dtArray[1];
	    dtDay= dtArray[3];
	    dtYear = dtArray[5];

	    if (dtMonth < 1 || dtMonth > 12)
	    	return false;
	    else if (dtDay < 1 || dtDay> 31)
	    	return false;
	    else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
	    	return false;
	    else if (dtMonth == 2)
	    {
	    	var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
	    	if (dtDay> 29 || (dtDay ==29 && !isleap))
	    		return false;
	    }
	    return true;
	},

	total: function(transaction){
		var difference = this.calculateAmountChange(transaction);

		this.collection.total = (Number(this.collection.total) + Number(difference));
		this.collection.totalView.render();

		return this;
	},

	calculateAmountChange: function(transaction){
		var amount = transaction.toJSON().amount.toString().replace(/,/g, "");
		var deposit = transaction.toJSON().deposit;
		var prevAmount = transaction.previous("amount") && transaction.previous("amount").toString().replace(/,/g, "") || 0;
		var prevDeposit = transaction.previous("deposit");
		var cleared = transaction.toJSON().cleared;
		var difference, operator;

		/* Sets the sign of the amount and prevAmount depending on if they are a debit or credit (deposit) */
		var setSign = function(deposit, amount){
			var operator = (deposit)? "+" : "-";
			return Number(operator + amount);
		}

		amount = setSign(deposit, amount);
		prevAmount = setSign(prevDeposit, prevAmount);

		difference = (amount >= prevAmount)? amount - prevAmount : -(amount - prevAmount);

		operator = ((deposit && difference < 0) || (!deposit && difference >= 0))? "-" : "";

		return eval(operator + Math.abs(difference));
	},

	/* Formats the amount field and then adds the formatted amount to the ledger total */
	formatAmount: function(ev){
		var transaction = this.transactionFromEvent(ev);
		var amount = $(ev.target).val().formatMoney(2, '.', ',');

		//TODO: need to do the below for several fields	
		transaction.set({amount: amount});
		$(ev.target).val(amount);

		this.total(transaction);

		return this;
	},

	updateTotal: function(ev){
		// console.log("updateTotal");
		var transaction = this.transactionFromEvent(ev);
		var deposit = $(ev.target).prop('checked');

		transaction.set({deposit: deposit});

		// this.collection.total = (Number(this.collection.total) + Number(transaction.toJSON().amount));
		this.total(transaction);
		return this;
	},

	/* Gets a transaction model from the ledger collection, old or new */
	transactionFromEvent: function(ev){
		var tr = $(ev.target).closest("tr");
		var id = tr.data("transaction-id");
		var transaction = this.collection.get(id) || this.collection.findWhere({tempId: id});

		return transaction;
	}
});
















