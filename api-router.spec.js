var util = require('util');
var express = require('express');
var request = require('supertest');
var apiRouter = require('./api-router');

// TODO: add tests for custom routes
// TODO: add tests for alias routes (get, post, put, delete, update)
// TODO: add tests for action/callback handling

describe('ExpressJS API router config', function () {
  it('should export a function on require', function () {
    expect(apiRouter).toEqual(jasmine.any(Function));
    expect(apiRouter.name).toBe('apiRouterInit');
  });

  it('should return an expressJS router after executing exported function', function () {
    var router = apiRouter();
    expect(router).toEqual(jasmine.any(Function));
    expect(router.name).toBe('router');
  });

  it('should not throw an error after mounting to an express object', function () {
    var app = express();
    expect(app.use('/', apiRouter())).toEqual(jasmine.any(Function));
  });

  describe('with router', function () {
    var app;
    var routes = [
      { path: '/', method: 'get', config: { type: 'get', statusCode: 200 } },
      { path: '/', method: 'get', config: { type: 'read', statusCode: 200 } },
      { path: '/foo', method: 'get', config: { type: 'get', statusCode: 200 } },
      { path: '/foo', method: 'get', config: { type: 'read', statusCode: 200 } },
      { path: '/foo', method: 'post', config: { type: 'post', statusCode: 200 } },
      { path: '/foo', method: 'post', config: { type: 'create', statusCode: 201 } },
      { path: '/foo/12345', method: 'get', config: { type: 'get', statusCode: 200 } },
      { path: '/foo/12345', method: 'get', config: { type: 'read', statusCode: 200 } },
      { path: '/foo/12345', method: 'put', config: { type: 'put', statusCode: 200 } },
      { path: '/foo/12345', method: 'put', config: { type: 'replace', statusCode: 200 } },
      { path: '/foo/12345', method: 'put', config: { type: 'update', statusCode: 200 } },
      { path: '/foo/12345', method: 'patch', config: { type: 'patch', statusCode: 200 } },
      { path: '/foo/12345', method: 'delete', config: { type: 'destroy', statusCode: 204 } },
      { path: '/foo/12345', method: 'delete', config: { type: 'delete', statusCode: 200 } }
    ];

    beforeEach(function reset() {
      app = express();
    });

    routes.forEach(function (route) {
      it(util.format('should not route: %s %s', route.method, route.path), function (done) {
        app.use('/', apiRouter());

        request(app)[route.method](route.path).end(function (err, res){
          expect(err).toBeNull();
          expect(res.statusCode).toBe(404);

          done();
        });
      });

      it(util.format('should route: %s %s', route.method, route.path), function (done) {
        var routeConfig = {};

        routeConfig[route.config.type] = {
          path: route.path,
          middleware: [function (req, res, next) {
            expect(req.path).toBe(route.path);
            expect(req.method).toBe(route.method.toUpperCase());

            res.locals.body = 'Foo';

            next();
          }]
        };

        app.use('/', apiRouter({routes: routeConfig}));

        request(app)[route.method](route.path).end(function (err, res){
          expect(err).toBeNull();
          expect(res.statusCode).toBe(route.config.statusCode);
          expect(res.body).toEqual(
            res.statusCode === 204 ?
            {} :
            {status: route.config.statusCode, message: 'OK', body: 'Foo'}
          );

          done();
        });
      });

      it(util.format('should apply global middleware to route: %s %s', route.method, route.path), function (done) {
        var routeConfig = {};

        routeConfig[route.config.type] = {
          path: route.path,
          middleware: [function (req, res, next) {
            expect(req.path).toBe(route.path);
            expect(req.method).toBe(route.method.toUpperCase());

            next();
          }]
        };

        app.use('/', apiRouter({
          middleware: [
            function (req, res, next) {
              res.locals.body = 'Bar';
              next();
            }
          ],
          routes: routeConfig
        }));

        request(app)[route.method](route.path).end(function (err, res){
          expect(err).toBeNull();
          expect(res.statusCode).toBe(route.config.statusCode);
          expect(res.body).toEqual(
            res.statusCode === 204 ?
            {} :
            {status: route.config.statusCode, message: 'OK', body: 'Bar'}
          );

          done();
        });
      });
    });
  });
});
