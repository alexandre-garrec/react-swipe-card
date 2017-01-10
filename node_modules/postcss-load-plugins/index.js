// ------------------------------------
// #POSTCSS - LOAD PLUGINS - INDEX
// ------------------------------------

'use strict'

var resolve = require('path').resolve

var config = require('cosmiconfig')
var assign = require('object-assign')

var loadPlugins = require('./lib/plugins')

/**
 * @author Michael Ciniawsky (@michael-ciniawsky) <michael.ciniawsky@gmail.com>
 * @description Autoload Plugins for PostCSS
 * @license MIT
 *
 * @module postcss-load-plugins
 * @version 1.0.0
 *
 * @requires cosmiconfig
 * @requires object-assign
 * @requires ./lib/plugins.js
 *
 * @method pluginsrc
 *
 * @param  {Object} ctx Context
 * @param  {String} path Directory
 * @param  {Object} options Options
 *
 * @return {Array} config PostCSS Plugins
 */
module.exports = function pluginsrc (ctx, path, options) {
  ctx = assign({ cwd: process.cwd(), env: process.env.NODE_ENV }, ctx)

  path = path ? resolve(path) : process.cwd()

  options = assign({}, options)

  if (ctx.env === undefined) {
    process.env.NODE_ENV = 'development'
  }

  var file

  return config('postcss', options)
    .load(path)
    .then(function (result) {
      if (result === undefined) {
        console.log('PostCSS Plugins could not be loaded.' + path)
      }

      file = result ? result.filepath : ''

      return result ? result.config : {}
    })
    .then(function (plugins) {
      if (typeof plugins === 'function') {
        plugins = plugins(ctx)
      }
      if (typeof result === 'object') {
        plugins = assign(plugins, ctx)
      }

      if (!plugins.plugins) {
        plugins.plugins = []
      }

      return {
        plugins: loadPlugins(plugins),
        file: file
      }
    })
    .catch(function (err) {
      console.log(err)
    })
}
