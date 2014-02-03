class Finances.Routers.TransactionsRouter extends Backbone.Router
  initialize: (options) ->
    console.log "initializing finance router"
    @transactions = new Finances.Collections.TransactionsCollection()
    @transactions.reset options.transactions

  routes:
    "new"      : "newTransaction"
    "index"    : "index"
    ":id/edit" : "edit"
    ":id"      : "show"
    ".*"        : "index"

  newTransaction: ->
    console.log "in transactions new route"
    @view = new Finances.Views.Transactions.NewView(collection: @transactions)
    $("#transactions").html(@view.render().el)

  index: ->
    console.log "in transactions index route"
    @view = new Finances.Views.Transactions.IndexView(transactions: @transactions)
    $("#transactions").html(@view.render().el)

  show: (id) ->
    console.log "in transactions show route"
    transaction = @transactions.get(id)

    @view = new Finances.Views.Transactions.ShowView(model: transaction)
    $("#transactions").html(@view.render().el)

  edit: (id) ->
    console.log "in transactions index route"
    transaction = @transactions.get(id)

    @view = new Finances.Views.Transactions.EditView(model: transaction)
    $("#transactions").html(@view.render().el)
