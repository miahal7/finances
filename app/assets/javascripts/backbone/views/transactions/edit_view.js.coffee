#Finances.Views.Transactions ||= {}
#
#class Finances.Views.Transactions.EditView extends Backbone.View
#  template: JST["backbone/templates/transactions/edit"]
#
#  events:
#    "submit #edit-transaction": "update"
#
#  update: (e) ->
#    e.preventDefault()
#    e.stopPropagation()
#
#    @model.save(null,
#      success: (transaction) =>
#        @model = transaction
#        window.location.hash = "/#{@model.id}"
#    )
#
#  render: ->
#    @$el.html(@template(@model.toJSON() ))
#
#    this.$("form").backboneLink(@model)
#
#    return this
