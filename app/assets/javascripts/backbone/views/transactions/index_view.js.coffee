Finances.Views.Transactions ||= {}

class Finances.Views.Transactions.IndexView extends Backbone.View
  template: JST["backbone/templates/transactions/index"]

  initialize: () ->
    @options.transactions.bind('reset', @addAll)

  addAll: () =>
    @options.transactions.each(@addOne)

  addOne: (transaction) =>
    view = new Finances.Views.Transactions.TransactionView({model : transaction})
    @$("tbody").append(view.render().el)

  render: =>
    @$el.html(@template(transactions: @options.transactions.toJSON() ))
    @addAll()

    return this
