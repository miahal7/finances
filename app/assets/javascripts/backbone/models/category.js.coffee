class Finances.Models.Category extends Backbone.Model
  paramRoot: 'category'

  defaults:
    name: null

class Finances.Collections.CategoriesCollection extends Backbone.Collection
  model: Finances.Models.Category
  url: '/categories'
