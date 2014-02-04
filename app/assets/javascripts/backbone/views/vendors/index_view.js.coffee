#Finances.Views.Vendors ||= {}
#
#class Finances.Views.Vendors.IndexView extends Backbone.View
#  template: JST["backbone/templates/vendors/index"]
#
#  initialize: () ->
#    @options.vendors.bind('reset', @addAll)
#
#  addAll: () =>
#    @options.vendors.each(@addOne)
#
#  addOne: (vendor) =>
#    view = new Finances.Views.Vendors.VendorView({model : vendor})
#    @$("tbody").append(view.render().el)
#
#  render: =>
#    @$el.html(@template(vendors: @options.vendors.toJSON() ))
#    @addAll()
#
#    return this
