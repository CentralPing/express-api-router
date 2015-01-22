var express = require('express');
var _ = require('lodash-node/modern');

module.exports = function apiRouterInit() {
  var router = new express.Router();

  [].slice.apply(arguments).forEach(function (config) {
    config = _.merge({
      routes: {},
      middleware: [],
      path: '/'
    }, config);

    // Assign collection middleware for all methods for path
    config.middleware.forEach(function assignMiddleware(middleware) {
      router.use(config.path, middleware);
    });

    //
    // Assign route middleware for standard method/path combinations
    //
    Object.keys(config.routes).forEach(function assignRoutes(route) {
      var options = {
        path: config.path,
        method: 'get',
        middleware: [],
        status: 200,
        action: function defaultAction(req, res, next) { next(); },
        callback: function defaultCallback(req, res, next, doc) {
          return res.status(options.status).send(doc);
        }
      };

      switch (route) {
        case 'create':
          options.callback = function createCallback(req, res, next, doc) {
            var path = req.originalUrl.split('?')[0].replace(/\/?$/, '/');
            return res.location(path + doc.id).status(201).send(doc);
          };
          /* falls through */
        case 'post':
          options.method = 'post';
          break;
        case 'read':
        case 'get':
          options.method = 'get';
          break;
        case 'replace':
        case 'update':
        case 'put':
          options.method = 'put';
          break;
        case 'patch':
          options.method = 'patch';
          break;
        case 'destroy':
          options.callback = function destroyCallback(req, res) {
            return res.status(204).end();
          };
          /* falls through */
        case 'delete':
          options.method = 'delete';
          break;
        default:
          break;
      }

      _.merge(options, config.routes[route]);

      options.middleware.push(function finishAction(req, res, next) {
        return options.action(req, res, function apiActionCallBack(err, doc) {
          if (err) { return next(err); }

          // Trigger 404
          if (!doc) { return next(); }

          return options.callback(req, res, next, doc);
        });
      });

      router.route(options.path)[options.method](options.middleware);
    });
  });

  return router;
};
