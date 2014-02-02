Finances.Views.Vendors ||= {}

class Finances.Views.Vendors.EditView extends Backbone.View
  template: JST["backbone/templates/vendors/edit"]

  events:
    "submit #edit-vendor": "update"

  update: (e) ->
    e.preventDefault()
    e.stopPropagation()

    @model.save(null,
      success: (vendor) =>
        @model = vendor
        window.location.hash = "/#{@model.id}"
    )

  render: ->
    @$el.html(@template(@model.toJSON() ))

    this.$("form").backboneLink(@model)

    return this
