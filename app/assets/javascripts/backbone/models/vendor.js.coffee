class Finances.Models.Vendor extends Backbone.Model
  paramRoot: 'vendor'

  defaults:
    name: null

class Finances.Collections.VendorsCollection extends Backbone.Collection
  model: Finances.Models.Vendor
  url: '/vendors'
