#Finances.Views.Transactions ||= {}
#
#class Finances.Views.Transactions.TransactionView extends Backbone.View
#  template: JST["backbone/templates/transactions/transaction"]
#
#  events:
#    "click .destroy" : "destroy"
#
#  tagName: "tr"
#
#  destroy: () ->
#    @model.destroy()
#    this.remove()
#
#    return false
#
#  render: ->
#    @$el.html(@template(@model.toJSON() ))
#    return this
