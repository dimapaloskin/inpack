'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Promise = require('bluebird');
var aggregateContext = require('./../aggregate-context');
var info = require('./info');
var InpackError = require('./../utils/error');
var createEmit = require('./../utils/create-emit');

var list = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(directory) {
    var _this = this;

    var _ret;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            return _context3.delegateYield(_regenerator2.default.mark(function _callee2() {
              var emit, context, modules, result, successed, failed;
              return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      emit = createEmit(_this);
                      _context2.next = 3;
                      return aggregateContext(directory);

                    case 3:
                      context = _context2.sent;

                      if (context.masterPath) {
                        _context2.next = 6;
                        break;
                      }

                      throw new InpackError('Master project has not been found');

                    case 6:

                      emit('info:context', context);

                      modules = context.inpack.modules;
                      _context2.next = 10;
                      return Promise.map(Object.keys(modules), function () {
                        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(name) {
                          var module, result;
                          return _regenerator2.default.wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  emit('list:info:module', name);
                                  module = modules[name];
                                  result = {
                                    isRejected: false,
                                    isFulfilled: false
                                  };
                                  _context.prev = 3;
                                  _context.next = 6;
                                  return info(directory, name);

                                case 6:
                                  result.value = _context.sent;

                                  result.isFulfilled = true;
                                  _context.next = 15;
                                  break;

                                case 10:
                                  _context.prev = 10;
                                  _context.t0 = _context['catch'](3);

                                  result.isRejected = true;
                                  result.reason = _context.t0;
                                  result.module = module;

                                case 15:
                                  return _context.abrupt('return', result);

                                case 16:
                                case 'end':
                                  return _context.stop();
                              }
                            }
                          }, _callee, _this, [[3, 10]]);
                        }));

                        return function (_x2) {
                          return _ref2.apply(this, arguments);
                        };
                      }(), { concurrency: 10 });

                    case 10:
                      result = _context2.sent;
                      successed = result.filter(function (_ref3) {
                        var isFulfilled = _ref3.isFulfilled;
                        return isFulfilled === true;
                      }).map(function (_ref4) {
                        var value = _ref4.value;
                        return value;
                      });
                      failed = result.filter(function (_ref5) {
                        var isRejected = _ref5.isRejected;
                        return isRejected === true;
                      }).map(function (_ref6) {
                        var reason = _ref6.reason,
                            module = _ref6.module;
                        return { reason: reason, module: module };
                      });


                      emit('list:info:end', { successed: successed.length, failed: failed.length });

                      return _context2.abrupt('return', {
                        v: { successed: successed, failed: failed }
                      });

                    case 15:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _callee2, _this);
            })(), 't0', 2);

          case 2:
            _ret = _context3.t0;

            if (!((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object")) {
              _context3.next = 5;
              break;
            }

            return _context3.abrupt('return', _ret.v);

          case 5:
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t1 = _context3['catch'](0);
            throw _context3.t1 instanceof Error || _context3.t1 instanceof InpackError ? _context3.t1 : new Error(_context3.t1);

          case 10:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 7]]);
  }));

  return function list(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = list;