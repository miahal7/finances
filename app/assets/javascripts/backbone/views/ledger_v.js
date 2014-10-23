// views/ledger.js

Finances.Views.Ledger = Backbone.View.extend({
	el: "#ledger",
	
	events: {
		"click #new-transaction": "addTransaction",
		"click .delete": "deleteTransaction",
		"click .editable": "highlightText",
		"keyup .editable, .datepicker": "keyboardNav", // Pressing Enter saves transaction
		"focus [data-behaviour~=datepicker]": "datepickerInit", // Picking date saves transaction
		"focus .vendor > input, .category > input": "typeaheadInit", // Saves Transaction on suggestion select
		"change .amount > input": "formatAmount", // Saves Transaction
		"change input.deposit, input.cleared" : "updateBalances", // Saves Transaction
		"change .recurring": "saveRecurring", // Saves Transaction
		"click #next-month, #prev-month": "changeLedgerMonth"
	},

	changeLedgerMonth: function (ev) {
		var prev = $(ev.target).attr("id").indexOf("prev") > -1;

		var date = this.collection.ledger_month;
		date = date.split("-");
		date = date[1] + "-" + date[2] + "-" + date[0];

		// In yyyy-mm-dd format, must be in mm-dd-yyyy or parsed
		var ledgerDate = new Date(date);
		var month = ledgerDate.getMonth()+1;
		var year = ledgerDate.getFullYear();

		if(prev === true) {
			month = month - 1;
			if(month === -1){
				month = "12";
				year = year - 1;				
			}
		}
		else {
			month = month + 1;
			if(month === "13") {
				month = "01";
				year = year + 1;
			}
		}

		if(month < 10) {
			month = "0" + month.toString();
		}

		var newDate = year + "-" + month + "-01";

		console.log("new date is -> " + newDate );
		
		new Finances.Collections.Ledger([], {ledger_month: newDate});

	},

	initialize: function(){
		this.template = JST["backbone/templates/ledger_t"]; 
		/* Watch collection for an added model. If one is added, add a row.
			 Also, when a row is added or deleted, change the total to reflect */
		this.listenTo(this.collection, 'add', this.addRow);
		this.listenTo(this.collection, 'add', this.total);
		this.listenTo(this.collection, 'remove', this.total);

		return this;
	},

	render: function () {
		this.$el.html(this.template());
				
		return this;
	},
	
	/* Adds a transaction to the ledger collection and scroll to it*/
	addTransaction: function (e) {
		var rand = 99999 + Math.floor(Math.random() * 999999);
		var newTransVendor;

		this.collection.add(new Finances.Models.Transaction({tempId: rand}));

		newTransVendor = $("#ledger-tbody").find("tr:last").find(".vendor > input");

		$("body").scrollTo(newTransVendor);

		newTransVendor.focus();
	},

	/* Adds an individual row to the ledger table */
	addRow: function (transaction) {
		var transactionView = new Finances.Views.Transaction({
			model: transaction,
			collection: this.collection
		});

		transactionView.render();
	},

	deleteTransaction: function (ev) {
		var transaction = this.transactionFromEvent(ev);
		var tr = $(ev.currentTarget).closest("tr");

		tr.remove();
		transaction.destroy();
	},

	/* If the user presses enter, this will save the transaction and go the the next field */
	keyboardNav: function (ev) {
		if (ev.which === 13) {
			var transaction = this.transactionFromEvent(ev);
			var value = $(ev.target).val();
			var td = $(ev.target).closest("td");
			var type = (td.attr("class") === "trans-date")? "date" : td.attr("class");
			var next;

			if (type === "vendor" || type === "category") {
				transaction.toJSON()[type]["name"] = value;
			}
			else if(type === "date"){
				var date = $(ev.target).val();						
				var isDate = Finances.isDate(date);

		    /*The default behavior of the datepicker is to make the input field blank when the same date as
		    what is already in the text field is selected. To get around this, whenever the date becomes blank,
		    revert the date back to the last valid selected date by saving the last valid date in data-date.*/
				if(isDate){
				  $(ev.target).data("date", date);
				  transaction.toJSON()[type] = date;
		    }
		    else{
		    	$(ev.target).val($(ev.target).data("date"));
		    	transaction.toJSON()[type] = $(ev.target).data("date");
			  }

			}
			else {
				transaction.toJSON()[type] = value;
			}

			next = $(ev.target).closest("td").next().find("input:text");
			next = (next.val() === undefined)? $(ev.target).closest("tr").next().find("td.vendor > input") : next;

		  ev.preventDefault();
		  if(type !== "date"){
			  transaction.save();
			  next.focus().select();
			}
    }
	},

	/* Initialize the typeahead with persistence */
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
				limit: 5,
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
				{ minLength: 1,	highlight: true, hint: true }, 
				{ displayKey: 'name', source: ta.ttAdapter()
			})
			.addClass("ta")
			.on("typeahead:selected", function($e, datum){
				/* Saves Selected Suggestion */
				(function () {
					var transaction = self.transactionFromEvent(ev);
					var type = $(ev.target).closest("td").attr("class");
					transaction.toJSON()[type]["name"] = datum.name;

					transaction.save();
				})();
			});
		}

		this.highlightText(ev);
	},

	/* Initialize datepicker with persistence */
	datepickerInit: function(ev){
		var self = this;
		var datePicker = $(ev.target);
		var transaction = this.transactionFromEvent(ev);

		var validDate = function(){
			var date = datePicker.val();
			var isValid = Finances.isDate(date) || false;

	    /*The default behavior of the datepicker is to make the input field blank when the same date as
	    what is already in the text field is selected. To get around this, whenever the date becomes blank,
	    revert the date back to the last valid selected date by saving the last valid date in data-date.*/
	    if(!isValid){					   
	    	date = datePicker.attr("data-date");
	    }

	    datePicker.attr("data-date", date);
	    transaction.set({"date": date});
	    datePicker.val(transaction.get("date"));

	    return isValid;
		};

    /*Checking if the datepicker has the datepicker class prevents the datepicker
    object from instantiating multiple times for each datepicker input field */
    if(!datePicker.hasClass("datepicker")){
	    datePicker.datepicker({
    		format: "mm/dd/yyyy",
    		todayBtn: "linked",
    		forceParse: true,
    		autoclose: true,
    		todayHighlight: true,
    		language: "en",
    		orientation: "right"
    	}).on("hide", function(){
    		/* Saves date if it's valid */
    		if(validDate()){
		    	transaction.save();
		  	}
    	}).on("changeDate", function(){
    		validDate();
    	});
    
  		datePicker.addClass("datepicker");
    }
	},	

	/* Iterates through each transaction and sets both balance and bank balance 
	   by checking deposit and cleared. */
	total: function(transaction){
		var self = this;
		var trans = {};
		var amount = 0;
		var deposit = false;
		var cleared = false;
		this.collection.balance = 0;
		this.collection.bankBalance = 0;

		this.collection.each(function(transaction){
			trans = transaction.toJSON();
			deposit = trans.deposit;
			cleared = trans.cleared;
			amount = trans.amount;

			/* If it is not a deposit, then subtract the transaction amount, otherwise, 
			   add it to balance. For balance, cleared is not considered. */
			if(!deposit){
				amount = -trans.amount;
			}
			
			self.collection.balance = Number(self.collection.balance) + Number(amount);

			/* If the transaction has not cleared then set it to 0 so that it does not affect 
			   the bankBalance. If it has cleared then complete the operation with the original
			   transaction amount. */
			if(!cleared){
				amount = 0;
			}

			self.collection.bankBalance = Number(self.collection.bankBalance) + Number(amount);
		});

		this.collection.balancesView.render();

		return this;
	},	

	/* Formats the amount field and then adds the formatted amount to the ledger total */
	formatAmount: function(ev){
		var transaction = this.transactionFromEvent(ev);
		var amount = $(ev.target).val().formatMoney(2, '.', ',');

		transaction.set({amount: amount});
		$(ev.target).val(amount);

		transaction.save();

		this.total(transaction);

		return this;
	},

	/* Updates deposit and cleared to make them reflect what's on the screen and then
	   updates the bankBalance and balance*/
	updateBalances: function(ev){
		var tr = $(ev.target).closest("tr");

		var transaction = this.transactionFromEvent(ev);
		var deposit = tr.find("td > .deposit").prop('checked');
		var cleared = tr.find("td > .cleared").prop('checked');

 		transaction.set({deposit: deposit, cleared: cleared});
 		
 		transaction.save();

		this.total(transaction);
		return this;
	},

	saveRecurring: function(ev) {
		var transaction = this.transactionFromEvent(ev);
  	var recurring = $(ev.target).prop('checked');

		transaction.set({recurring: recurring});
		transaction.save()

		return this;
	},

	/* Gets the transaction id from the tr element and then searches the 
	   ledger collection for that id. */
	transactionFromEvent: function(ev){
		var tr = $(ev.target).closest("tr");
		var id = tr.data("transaction-id");
		var transaction = this.collection.get(id) || this.collection.findWhere({tempId: id});

		return transaction;
	},	

	highlightText: function (ev) {
		setTimeout(function () {
			$(ev.target).select();	
		}, 0);
	}
});