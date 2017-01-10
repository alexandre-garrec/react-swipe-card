// ------------------------------------
// #POSTCSS - LOAD PLUGINS - PLUGINS
// ------------------------------------

'use strict'

/**
 * @method plugins
 *
 * @param {Object} config PostCSS Config
 *
 * @return {Array} plugins PostCSS Plugins
 */
module.exports = function plugins (config) {
  var plugins = []

  if (Array.isArray(config.plugins)) {
    plugins = config.plugins

    plugins = plugins.filter(Boolean)

    if (plugins.length && plugins.length > 0) {
      plugins.forEach(function (plugin) {
        if (!plugin) {
          var error = new Error(
           'Loading PostCSS Plugin failed. Please check your PostCSS Config'
          )

          console.log(error.message)

          return
        }

        if (plugin.postcss) {
          plugin = plugin.postcss
        }

        if (plugin.default) {
          plugin = plugin.default
        }

        if (
          !(typeof plugin === 'object' && Array.isArray(plugin.plugins) ||
          typeof plugin === 'function')
        ) {
          throw new TypeError(
            'Invalid PostCSS Plugin found. Please check your PostCSS Config'
          )
        }
      })
    }

    return plugins
  } else {
    config = config.plugins

    var load = function (plugin, options) {
      if (options === null || Object.keys(options).length === 0) {
        try {
          return require(plugin)
        } catch (err) {
          console.log(err.message)
        }
      } else {
        try {
          return require(plugin)(options)
        } catch (err) {
          console.log(err.message)
        }
      }
    }

    Object.keys(config)
      .filter(function (plugin) {
        return config[plugin] !== false ? plugin : ''
      })
      .forEach(function (plugin) {
        plugin = load(plugin, config[plugin])

        if (!plugin) {
          var error = new Error(
           'Loading PostCSS Plugin failed. Please check your PostCSS Config'
          )

          console.log(error.message)

          return
        }

        if (plugin.postcss) {
          plugin = plugin.postcss
        }

        if (plugin.default) {
          plugin = plugin.default
        }

        if (
          !(typeof plugin === 'object' && Array.isArray(plugin.plugins) ||
          typeof plugin === 'function')
        ) {
          var err = new TypeError(
            'Invalid PostCSS Plugin found. Please check your PostCSS Config'
          )

          console.log(err.message)

          return
        }

        return plugins.push(plugin)
      })

    return plugins
  }
}
