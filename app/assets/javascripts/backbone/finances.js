//= require_self
//= require_tree ./templates
//= require_tree ./models
//= require_tree ./views
//= require_tree ./routers
//= require_tree ./collections

// include the CSRF token with every ajax call
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
            Finances.options = options;
            this.Router = new Finances.Router();

            if (!Backbone.history.started) {
                Backbone.history.start();
            }			
        }
    };    
})();

Number.prototype.formatMoney = String.prototype.formatMoney = function(c, d, t){
    var n = this.toString().replace(/[a-zA-Z!@#$%^&*();:,]/g, ''),
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "," : d,
        t = t == undefined ? "." : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;

    var formatted = s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");    

    return formatted;
};
