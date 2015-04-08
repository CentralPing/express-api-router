var express = require('express');
var _ = require('lodash-node/modern');

module.exports = function apiRouterInit() {
  var router = new express.Router();

  [].slice.apply(arguments).forEach(function (config) {
    config = _.merge({
      routes: {},
      middleware: [],
      params: [],
      path: '/',
      respObjPaths: {
        message: 'message',
        status: 'status',
        body: 'body'
      },
      bodyPath: 'body',
      resourceIdPath: 'resourceId'
    }, config);

    // Assign collection global middleware
    config.params.forEach(function assignParam(param) {
      router.param(param.name, param.callback);
    });

    // Assign route middleware for method/path combinations
    Object.keys(config.routes).forEach(function assignRoutes(route) {
      var options = {
        path: config.path,
        method: 'get',
        middleware: [],
        status: 200,
        message: 'OK'
      };

      switch (route.toLowerCase()) {
        case 'create':
          options.status = 201;
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
          options.status = 204;
          /* falls through */
        case 'delete':
          options.method = 'delete';
          break;
        default:
          break;
      }

      _.merge(options, {
        respObjPaths: config.respObjPaths,
        bodyPath: config.bodyPath,
        resourceIdPath: config.resourceIdPath,
      }, config.routes[route]);

      // Assign global middleware
      [].unshift.apply(options.middleware, config.middleware);

      // Assign route handlers
      options.middleware.push(function response(req, res, next) {
        var path;
        var respObj = {};

        // Trigger 404
        // - to avoid erroneous 404 while sending 204 repsonses set body to null
        //   or anything other than undefined
        if (res.locals[options.bodyPath] === undefined) { return next(); }

        if (options.status === 201 && res.locals[options.resourceIdPath] !== undefined) {
          path = req.originalUrl.split('?')[0].replace(/\/?$/, '/');
          res.location(path + res.locals[options.resourceIdPath]);
        }

        respObj[options.respObjPaths.status] = options.status;
        respObj[options.respObjPaths.message] = options.message;
        respObj[options.respObjPaths.body] = res.locals[options.bodyPath];

        // Status code 204 will always send an empty body
        res.status(options.status).send(respObj);
      });

      router.route(options.path)[options.method](options.middleware);
    });
  });

  return router;
};
