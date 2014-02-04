#Finances.Views.Vendors ||= {}
#
#class Finances.Views.Vendors.VendorView extends Backbone.View
#  template: JST["backbone/templates/vendors/vendor"]
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
