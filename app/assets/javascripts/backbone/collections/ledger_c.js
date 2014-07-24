// js/collections/ledger.js

Finances.Collections = Finances.Collections || {}; // initialize our collections namespace if it has not been done already

Finances.Collections.Ledger = Backbone.Collection.extend({

    model: Finances.Models.Transaction,

    url: '/transactions/',

    initialize: function(){
		this.fetch();
		this.total = 0;

    	new Finances.Views.Ledger({collection: this}).render();
    	this.totalView = new Finances.Views.Totals({collection: this});

    	this.on('')
    },

    findById: function(){

    }


});

