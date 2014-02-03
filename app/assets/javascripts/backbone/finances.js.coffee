#= require_self
#= require_tree ./templates
#= require_tree ./models
#= require_tree ./views
#= require_tree ./routers

window.Finances =
  Models: {}
  Collections: {}
  Routers: {}
  Views: {}

  init: (options) ->
    console.log ("initializing Finances with options " + options)
    Finances.options = options
    new Finances.Routers.TransactionsRouter(options)

    if !Backbone.history.started
      Backbone.history.start()
      Backbone.history.started = true