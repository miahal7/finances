class Finances.Routers.VendorsRouter extends Backbone.Router
  initialize: (options) ->
    @vendors = new Finances.Collections.VendorsCollection()
    @vendors.reset options.vendors

  routes:
    "new"      : "newVendor"
    "index"    : "index"
    ":id/edit" : "edit"
    ":id"      : "show"
    ".*"        : "index"

  newVendor: ->
    @view = new Finances.Views.Vendors.NewView(collection: @vendors)
    $("#vendors").html(@view.render().el)

  index: ->
    @view = new Finances.Views.Vendors.IndexView(vendors: @vendors)
    $("#vendors").html(@view.render().el)

  show: (id) ->
    vendor = @vendors.get(id)

    @view = new Finances.Views.Vendors.ShowView(model: vendor)
    $("#vendors").html(@view.render().el)

  edit: (id) ->
    vendor = @vendors.get(id)

    @view = new Finances.Views.Vendors.EditView(model: vendor)
    $("#vendors").html(@view.render().el)
