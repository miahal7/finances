class Finances.Routers.TransactionsRouter extends Backbone.Router
  initialize: (options) ->
    @transactions = new Finances.Collections.TransactionsCollection()
    @transactions.reset options.transactions

  routes:
    "new"      : "newTransaction"
    "index"    : "index"
    ":id/edit" : "edit"
    ":id"      : "show"
    ".*"        : "index"

  newTransaction: ->
    @view = new Finances.Views.Transactions.NewView(collection: @transactions)
    $("#transactions").html(@view.render().el)

  index: ->
    @view = new Finances.Views.Transactions.IndexView(transactions: @transactions)
    $("#transactions").html(@view.render().el)

  show: (id) ->
    transaction = @transactions.get(id)

    @view = new Finances.Views.Transactions.ShowView(model: transaction)
    $("#transactions").html(@view.render().el)

  edit: (id) ->
    transaction = @transactions.get(id)

    @view = new Finances.Views.Transactions.EditView(model: transaction)
    $("#transactions").html(@view.render().el)
