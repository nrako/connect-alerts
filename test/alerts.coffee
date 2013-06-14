### global describe, it, beforeEach ###

chai = require 'chai'
expect = chai.expect
alerts = require '../index'
sessionStore = {}

describe 'Quick & dirty tests for connect-alerts', ->

  it 'provides a connect middleware', (next) ->
    expect(alerts).to.be.a 'function'
    middleware = alerts()
    expect(middleware).to.be.a 'function'
    expect(middleware.length).to.equal 3

    middleware {session: sessionStore}, {}, ->
      next()

  it 'requires session', ->
    middleware = alerts()

    fn = ->
      middleware {}, {}, ->

    expect(fn).to.throw Error
    expect(fn).to.throw /session/

  it 'works as a standalone method with a render callback', (next) ->

    alerts
      template: __dirname + '/templates/alert.jade',
      engine: 'jade'

    alerts.alert 'the message', 'info', {}, (err, data) ->
      expect(data.html).to.equal '<div class="alert alert-info">the message<a data-dismiss="alert" href="#" class="close">&times;</a></div>'
      next()

  it 'works great with an express workflow', (next) ->
    middleware = alerts
      template: __dirname + '/templates/alert.jade',
      engine: 'jade'

    req =
      session: sessionStore

    res =
      locals: {}

    middleware req, res, ->
      expect(res.alert).to.be.a 'function'
      expect(res.locals.getAlerts).to.be.a 'function'
      expect(res.locals.deleteAlerts).to.be.a 'function'

      res.alert 'info message'
      res.alert 'error message', 'error'

      alerts = res.locals.getAlerts()

      expect(alerts.length).to.equal 2

      # deep equal doesn't work as expected
      #expect(alerts[0]).to.deep.equal {type: 'info', msg: 'info message'}
      #expect(alerts[1]).to.deep.equal {type: 'error', msg: 'error message'}
      expect(alerts[0].type).to.equal 'info'
      expect(alerts[0].msg).to.equal 'info message'
      expect(alerts[1].type).to.equal 'error'

      res.locals.deleteAlerts()
      expect(res.locals.getAlerts().length).to.equal 0
      next()
