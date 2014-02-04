// views/myview.js

Finances.Views = Finances.Views || {};

Finances.Views.MyView = Backbone.View.extend({
 
	el: '#app-content', // target HTML DOM element

	initialize: function(){
		_.bindAll(this); // underscore event wiring

//        console.log("-------" + this)

		this.template = JST["templates/myview"]; // set the template to be used
		this.model.fetch(); // comment this out if you are not using a bb model

//        console.log("My View Initialized with " + this.template);


        this.render(); // go ahead and render our view
	},

	render: function(){
		// render the template with data to the target HTML DOM element
		$(this.el).html(this.template(this.model.toJSON())); // use call toJSON only on bb models
		console.log("My View Rendered!");
		return this;
	}
});