var apiFilter = require('./api-router');
var async = require('async');

// TODO: add tests for custom routes
// TODO: add tests for alias routes (get, post, put, delete, update)
// TODO: add tests for action/callback handling

describe('ExpressJS API router config', function () {
  it('should export a function on require', function () {
    expect(apiFilter).toEqual(jasmine.any(Function));
    expect(apiFilter.name).toBe('apiRouterInit');
  });

  it('should return an expressJS router after executing exported function', function () {
    var router = apiFilter();
    expect(router).toEqual(jasmine.any(Function));
    expect(router.name).toBe('router');
  });

  describe('with router', function () {
    var requests;

    beforeEach(function () {
      requests = [
        { hit: 0, url: 'http://example.com/', method: 'GET' },
        { hit: 0, url: 'http://example.com/foo', method: 'GET' },
        { hit: 0, url: 'http://example.com/foo', method: 'POST' },
        { hit: 0, url: 'http://example.com/foo/12345', method: 'GET' },
        { hit: 0, url: 'http://example.com/foo/12345', method: 'PUT' },
        { hit: 0, url: 'http://example.com/foo/12345', method: 'PATCH' },
        { hit: 0, url: 'http://example.com/foo/12345', method: 'DELETE' }
      ];
    });

    it('should not route any requests', function (done) {
      var router = apiFilter();

      async.each(requests, function (request, cb) {
        router.handle(request, {}, function (err) {
          expect(err).toBeUndefined();
          expect(request.hit).toEqual(0);

          cb();
        });
      }, done);
    });

    it('should only route GET `/`', function (done) {
      var router = apiFilter({
        routes: {
          read: {
            action: function (req, res, next) {
              expect(req.hit++).toEqual(0);
              expect(req.url).toEqual(requests[0].url);

              next();
            }
          }
        }
      });

      async.each(requests, function (request, cb) {
        router.handle(request, {}, function (err) {
          expect(err).toBeUndefined();

          if (request.url === requests[0].url && request.method === requests[0].method) {
            expect(request.hit).toEqual(1);
          }
          else {
            expect(request.hit).toEqual(0);
          }

          cb();
        });
      }, done);
    });

    it('should only route GET `/foo`', function (done) {
      var router = apiFilter({
        path: '/foo',
        routes: {
          read: {
            action: function (req, res, next) {
              expect(req.hit++).toEqual(0);
              expect(req.url).toEqual(requests[1].url);

              next();
            }
          }
        }
      });

      async.each(requests, function (request, cb) {
        router.handle(request, {}, function (err) {
          expect(err).toBeUndefined();

          if (request.url === requests[1].url && request.method === requests[1].method) {
            expect(request.hit).toEqual(1);
          }
          else {
            expect(request.hit).toEqual(0);
          }

          cb();
        });
      }, done);
    });

    it('should only route POST `/foo`', function (done) {
      var router = apiFilter({
        path: '/foo/:id?',
        routes: {
          create: {
            action: function (req, res, next) {
              expect(req.hit++).toEqual(0);
              expect(req.url).toEqual(requests[2].url);

              next();
            }
          }
        }
      });

      async.each(requests, function (request, cb) {
        router.handle(request, {}, function (err) {
          expect(err).toBeUndefined();

          if (request.url === requests[2].url && request.method === requests[2].method) {
            expect(request.hit).toEqual(1);
          }
          else {
            expect(request.hit).toEqual(0);
          }

          cb();
        });
      }, done);
    });

    it('should only route GET `/foo/12345`', function (done) {
      var router = apiFilter({
        path: '/foo/:id',
        routes: {
          read: {
            action: function (req, res, next) {
              expect(req.hit++).toEqual(0);
              expect(req.url).toEqual(requests[3].url);

              next();
            }
          }
        }
      });

      async.each(requests, function (request, cb) {
        router.handle(request, {}, function (err) {
          expect(err).toBeUndefined();

          if (request.url === requests[3].url && request.method === requests[3].method) {
            expect(request.hit).toEqual(1);
          }
          else {
            expect(request.hit).toEqual(0);
          }

          cb();
        });
      }, done);
    });

    it('should only route PUT `/foo/12345`', function (done) {
      var router = apiFilter({
        path: '/foo/:id?',
        routes: {
          replace: {
            action: function (req, res, next) {
              expect(req.hit++).toEqual(0);
              expect(req.url).toEqual(requests[4].url);

              next();
            }
          }
        }
      });

      async.each(requests, function (request, cb) {
        router.handle(request, {}, function (err) {
          expect(err).toBeUndefined();

          if (request.url === requests[4].url && request.method === requests[4].method) {
            expect(request.hit).toEqual(1);
          }
          else {
            expect(request.hit).toEqual(0);
          }

          cb();
        });
      }, done);
    });

    it('should only route PATCH `/foo/12345`', function (done) {
      var router = apiFilter({
        path: '/foo/:id?',
        routes: {
          patch: {
            action: function (req, res, next) {
              expect(req.hit++).toEqual(0);
              expect(req.url).toEqual(requests[5].url);

              next();
            }
          }
        }
      });

      async.each(requests, function (request, cb) {
        router.handle(request, {}, function (err) {
          expect(err).toBeUndefined();

          if (request.url === requests[5].url && request.method === requests[5].method) {
            expect(request.hit).toEqual(1);
          }
          else {
            expect(request.hit).toEqual(0);
          }

          cb();
        });
      }, done);
    });

    it('should only route DELETE `/foo/12345`', function (done) {
      var router = apiFilter({
        path: '/foo/:id?',
        routes: {
          destroy: {
            action: function (req, res, next) {
              expect(req.hit++).toEqual(0);
              expect(req.url).toEqual(requests[6].url);

              next();
            }
          }
        }
      });

      async.each(requests, function (request, cb) {
        router.handle(request, {}, function (err) {
          expect(err).toBeUndefined();

          if (request.url === requests[6].url && request.method === requests[6].method) {
            expect(request.hit).toEqual(1);
          }
          else {
            expect(request.hit).toEqual(0);
          }

          cb();
        });
      }, done);
    });

    describe('with multiple configs', function () {
      it('should process the routes in order', function (done) {
        var router = apiFilter(
          {
            path: '/:route?',
            routes: {
              get: {
                action: function (req, res, next) {
                  expect(req.hit++).toEqual(0);

                  if (req.params.route) {
                    expect(req.url).toEqual(requests[1].url);
                  }
                  else {
                    expect(req.url).toEqual(requests[0].url);
                  }

                  next();
                }
              }
            }
          },
          {
            path: '/foo',
            routes: {
              get: {
                action: function (req, res, next) {
                  expect(req.hit++).toEqual(1);
                  expect(req.url).toEqual(requests[1].url);

                  next();
                }
              }
            }
          }
        );

        async.each(requests, function (request, cb) {
          router.handle(request, {}, function (err) {
            expect(err).toBeUndefined();

            if (request.url === requests[0].url && request.method === requests[0].method) {
              expect(request.hit).toEqual(1);
            }
            else if (request.url === requests[1].url && request.method === requests[1].method) {
              expect(request.hit).toEqual(2);
            }
            else {
              expect(request.hit).toEqual(0);
            }

            cb();
          });
        }, done);
      });
    });

    describe('with middleware', function () {
      it('should apply middleware to all routes/methods', function (done) {
        var router = apiFilter({
          middleware: [
            function (req, res, next) {
              expect(req.hit++).toEqual(0);
              next();
            }
          ],
          path: '/foo/:id?',
          routes: {
            read: {
              action: function (req, res, next) {
                if (req.params.id) {
                  expect(req.hit++).toEqual(1);
                  expect(req.url).toEqual(requests[3].url);
                }
                else {
                  expect(req.hit++).toEqual(1);
                  expect(req.url).toEqual(requests[1].url);
                }

                next();
              }
            },
            create: {
              action: function (req, res, next) {
                expect(req.hit++).toEqual(1);
                expect(req.url).toEqual(requests[2].url);

                next();
              }
            },
            replace: {
              action: function (req, res, next) {
                expect(req.hit++).toEqual(1);
                expect(req.url).toEqual(requests[4].url);

                next();
              }
            },
            patch: {
              action: function (req, res, next) {
                expect(req.hit++).toEqual(1);
                expect(req.url).toEqual(requests[5].url);

                next();
              }
            },
            destroy: {
              action: function (req, res, next) {
                expect(req.hit++).toEqual(1);
                expect(req.url).toEqual(requests[6].url);

                next();
              }
            }
          }
        });

        async.each(requests, function (request, cb) {
          router.handle(request, {}, function (err) {
            expect(err).toBeUndefined();

            if (request.url === requests[0].url) {
              expect(request.hit).toEqual(0);
            }
            else {
              expect(request.hit).toEqual(2);
            }

            cb();
          });
        }, done);
      });

      it('should only apply to route GET `/`', function (done) {
        var router = apiFilter({
          routes: {
            read: {
              middleware: [
                function (req, res, next) {
                  expect(req.hit++).toEqual(0);
                  next();
                }
              ],
              action: function (req, res, next) {
                expect(req.hit++).toEqual(1);
                expect(req.url).toEqual(requests[0].url);

                next();
              }
            }
          }
        });

        async.each(requests, function (request, cb) {
          router.handle(request, {}, function (err) {
            expect(err).toBeUndefined();

            if (request.url === requests[0].url && request.method === requests[0].method) {
              expect(request.hit).toEqual(2);
            }
            else {
              expect(request.hit).toEqual(0);
            }

            cb();
          });
        }, done);
      });

      it('should only apply to route GET `/foo`', function (done) {
        var router = apiFilter({
          path: '/foo',
          routes: {
            read: {
              middleware: [
                function (req, res, next) {
                  expect(req.hit++).toEqual(0);
                  next();
                }
              ],
              action: function (req, res, next) {
                expect(req.hit++).toEqual(1);
                expect(req.url).toEqual(requests[1].url);

                next();
              }
            }
          }
        });

        async.each(requests, function (request, cb) {
          router.handle(request, {}, function (err) {
            expect(err).toBeUndefined();

            if (request.url === requests[1].url && request.method === requests[1].method) {
              expect(request.hit).toEqual(2);
            }
            else {
              expect(request.hit).toEqual(0);
            }

            cb();
          });
        }, done);
      });

      it('should only apply to route POST `/foo`', function (done) {
        var router = apiFilter({
          path: '/foo/:id?',
          routes: {
            create: {
              middleware: [
                function (req, res, next) {
                  expect(req.hit++).toEqual(0);
                  next();
                }
              ],
              action: function (req, res, next) {
                expect(req.hit++).toEqual(1);
                expect(req.url).toEqual(requests[2].url);

                next();
              }
            }
          }
        });

        async.each(requests, function (request, cb) {
          router.handle(request, {}, function (err) {
            expect(err).toBeUndefined();

            if (request.url === requests[2].url && request.method === requests[2].method) {
              expect(request.hit).toEqual(2);
            }
            else {
              expect(request.hit).toEqual(0);
            }

            cb();
          });
        }, done);
      });

      it('should only apply to route GET `/foo/12345`', function (done) {
        var router = apiFilter({
          path: '/foo/:id',
          routes: {
            read: {
              middleware: [
                function (req, res, next) {
                  expect(req.hit++).toEqual(0);
                  next();
                }
              ],
              action: function (req, res, next) {
                expect(req.hit++).toEqual(1);
                expect(req.url).toEqual(requests[3].url);

                next();
              }
            }
          }
        });

        async.each(requests, function (request, cb) {
          router.handle(request, {}, function (err) {
            expect(err).toBeUndefined();

            if (request.url === requests[3].url && request.method === requests[3].method) {
              expect(request.hit).toEqual(2);
            }
            else {
              expect(request.hit).toEqual(0);
            }

            cb();
          });
        }, done);
      });

      it('should only apply to route PUT `/foo/12345`', function (done) {
        var router = apiFilter({
          path: '/foo/:id?',
          routes: {
            replace: {
              middleware: [
                function (req, res, next) {
                  expect(req.hit++).toEqual(0);
                  next();
                }
              ],
              action: function (req, res, next) {
                expect(req.hit++).toEqual(1);
                expect(req.url).toEqual(requests[4].url);

                next();
              }
            }
          }
        });

        async.each(requests, function (request, cb) {
          router.handle(request, {}, function (err) {
            expect(err).toBeUndefined();

            if (request.url === requests[4].url && request.method === requests[4].method) {
              expect(request.hit).toEqual(2);
            }
            else {
              expect(request.hit).toEqual(0);
            }

            cb();
          });
        }, done);
      });

      it('should only apply to route PATCH `/foo/12345`', function (done) {
        var router = apiFilter({
          path: '/foo/:id?',
          routes: {
            patch: {
              middleware: [
                function (req, res, next) {
                  expect(req.hit++).toEqual(0);
                  next();
                }
              ],
              action: function (req, res, next) {
                expect(req.hit++).toEqual(1);
                expect(req.url).toEqual(requests[5].url);

                next();
              }
            }
          }
        });

        async.each(requests, function (request, cb) {
          router.handle(request, {}, function (err) {
            expect(err).toBeUndefined();

            if (request.url === requests[5].url && request.method === requests[5].method) {
              expect(request.hit).toEqual(2);
            }
            else {
              expect(request.hit).toEqual(0);
            }

            cb();
          });
        }, done);
      });

      it('should only apply to route DELETE `/foo/12345`', function (done) {
        var router = apiFilter({
          path: '/foo/:id?',
          routes: {
            destroy: {
              middleware: [
                function (req, res, next) {
                  expect(req.hit++).toEqual(0);
                  next();
                }
              ],
              action: function (req, res, next) {
                expect(req.hit++).toEqual(1);
                expect(req.url).toEqual(requests[6].url);

                next();
              }
            }
          }
        });

        async.each(requests, function (request, cb) {
          router.handle(request, {}, function (err) {
            expect(err).toBeUndefined();

            if (request.url === requests[6].url && request.method === requests[6].method) {
              expect(request.hit).toEqual(2);
            }
            else {
              expect(request.hit).toEqual(0);
            }

            cb();
          });
        }, done);
      });
    });
  });
});
