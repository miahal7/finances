#class Finances.Routers.CategoriesRouter extends Backbone.Router
#  initialize: (options) ->
#    @categories = new Finances.Collections.CategoriesCollection()
#    @categories.reset options.categories
#
#  routes:
#    "new"      : "newCategory"
#    "index"    : "index"
#    ":id/edit" : "edit"
#    ":id"      : "show"
#    ".*"        : "index"
#
#  newCategory: ->
#    @view = new Finances.Views.Categories.NewView(collection: @categories)
#    $("#categories").html(@view.render().el)
#
#  index: ->
#    @view = new Finances.Views.Categories.IndexView(categories: @categories)
#    $("#categories").html(@view.render().el)
#
#  show: (id) ->
#    category = @categories.get(id)
#
#    @view = new Finances.Views.Categories.ShowView(model: category)
#    $("#categories").html(@view.render().el)
#
#  edit: (id) ->
#    category = @categories.get(id)
#
#    @view = new Finances.Views.Categories.EditView(model: category)
#    $("#categories").html(@view.render().el)
