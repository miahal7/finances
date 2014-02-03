Finances.Views.Transactions ||= {}

class Finances.Views.Transactions.IndexView extends Backbone.View
  template: JST["backbone/templates/transactions/index"]

  initialize: () ->
    console.log "in transactions init function"
    @options.transactions.bind('reset', @addAll)

  addAll: () =>
    console.log "in transactions addAll function"
    @options.transactions.each(@addOne)

  addOne: (transaction) =>
    console.log "in transactions addOne function"
    view = new Finances.Views.Transactions.TransactionView({model : transaction})
    @$("tbody").append(view.render().el)

  render: =>
    console.log "in transactions render function"
    @$el.html(@template(transactions: @options.transactions.toJSON() ))
    @addAll()

    return this
