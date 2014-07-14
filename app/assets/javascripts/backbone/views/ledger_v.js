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
		"change .amount > input": "moneyFormat"

		// 'typeahead:selected .vendor-typeahead' : 'saveTransaction',
		// 'typeahead:selected .category-typeahead' : 'saveTransaction'
	},
	
	initialize: function(){
		this.template = JST["backbone/templates/ledger_t"]; 
		/* Watch collection for an added model. If one is added, add a row. */
		this.listenTo(this.collection, 'add', this.addRow);

		return this;
	},

	render: function(){
		this.$el.html(this.template());
		/* Adds a row for each model in the collection */
		this.collection.forEach(this.addRow, this);
				
		return this;
	},

	/* Adds an individual row to the ledger table */
	addRow: function(transaction){
		var transactionView = new Finances.Views.Transaction({
			model: transaction,
			collection: this.collection
		});
		transactionView.render();

		console.log("total -> " + this.collection.total);
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
		this.collection.add(new Finances.Models.Transaction());
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

	moneyFormat: function(ev){
		var amount = $(ev.target).val();
		amount = amount.formatMoney(2, '.', ',');

		$(ev.target).val(amount);

		this.collection.total = (parseFloat(this.collection.total) + parseFloat(amount)).formatMoney(2, '.', ',');

		console.log("total -> " + this.collection.total);

	}

});
















