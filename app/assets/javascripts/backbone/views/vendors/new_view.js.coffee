#Finances.Views.Vendors ||= {}
#
#class Finances.Views.Vendors.NewView extends Backbone.View
#  template: JST["backbone/templates/vendors/new"]
#
#  events:
#    "submit #new-vendor": "save"
#
#  constructor: (options) ->
#    super(options)
#    @model = new @collection.model()
#
#    @model.bind("change:errors", () =>
#      this.render()
#    )
#
#  save: (e) ->
#    e.preventDefault()
#    e.stopPropagation()
#
#    @model.unset("errors")
#
#    @collection.create(@model.toJSON(),
#      success: (vendor) =>
#        @model = vendor
#        window.location.hash = "/#{@model.id}"
#
#      error: (vendor, jqXHR) =>
#        @model.set({errors: $.parseJSON(jqXHR.responseText)})
#    )
#
#  render: ->
#    @$el.html(@template(@model.toJSON() ))
#
#    this.$("form").backboneLink(@model)
#
#    return this
