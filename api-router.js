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

    // Assign collection global middleware
    config.middleware.forEach(function assignMiddleware(middleware) {
      router.use(config.path, middleware);
    });

    // Assign route middleware for method/path combinations
    Object.keys(config.routes).forEach(function assignRoutes(route) {
      var options = {
        path: config.path,
        method: 'get',
        middleware: [],
        status: 200,
        message: 'OK',
        idPath: 'resourceId'
      };

      switch (route.toLowerCase()) {
        case 'create':
        case 'post':
          options.status = 201;
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
        case 'delete':
          options.status = 204;
          options.method = 'delete';
          break;
        default:
          break;
      }

      _.merge(options, config.routes[route]);

      options.middleware.push(function response(req, res, next) {
        var path;

        // Trigger 404
        if (!res.locals.body) { return next(); }

        if (options.status === 201 && res.locals[options.idPath] !== undefined) {
          path = req.originalUrl.split('?')[0].replace(/\/?$/, '/');
          res.location(path + res.locals[options.idPath]);
        }

        // Status code 204 will always send an empty object for a JSON response
        res.status(options.status).send({
          http_code: options.status,
          status: 'OK',
          body: res.locals.body
        });
      });

      router.route(options.path)[options.method](options.middleware);
    });
  });

  return router;
};
