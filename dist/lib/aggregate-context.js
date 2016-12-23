'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('path'),
    resolve = _require.resolve,
    join = _require.join;

var debug = require('debug')('inpack:aggregate-context');
var constants = require('./constants');
var InpackError = require('./utils/error');
var fs = require('./utils/fs');

var isInpackJsonAccessible = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(directory) {
    var isAccessible;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            isAccessible = true;
            _context.prev = 1;
            _context.next = 4;
            return fs.accessAsync(join(directory, constants.inpackConfigName), fs.constants.R_OK);

          case 4:
            _context.next = 9;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context['catch'](1);

            isAccessible = false;

          case 9:
            return _context.abrupt('return', isAccessible);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 6]]);
  }));

  return function isInpackJsonAccessible(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getInpackJson = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(directory) {
    var path;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            path = join(directory, constants.inpackConfigName);
            _context2.next = 4;
            return fs.readJsonAsync(path);

          case 4:
            return _context2.abrupt('return', _context2.sent);

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2['catch'](0);
            return _context2.abrupt('return', null);

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 7]]);
  }));

  return function getInpackJson(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var getPackageJson = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(directory) {
    var pkgPath;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            pkgPath = join(directory, 'package.json');
            _context3.next = 4;
            return fs.readJsonAsync(pkgPath);

          case 4:
            return _context3.abrupt('return', _context3.sent);

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3['catch'](0);
            return _context3.abrupt('return', null);

          case 10:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 7]]);
  }));

  return function getPackageJson(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var detectMaster = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(directory) {
    var parentDirectory, isMaster;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            parentDirectory = resolve(join(directory, '../'));

            if (!(parentDirectory === directory)) {
              _context4.next = 3;
              break;
            }

            return _context4.abrupt('return', null);

          case 3:
            _context4.next = 5;
            return isInpackJsonAccessible(parentDirectory);

          case 5:
            isMaster = _context4.sent;

            if (!isMaster) {
              _context4.next = 8;
              break;
            }

            return _context4.abrupt('return', parentDirectory);

          case 8:
            _context4.next = 10;
            return detectMaster(parentDirectory);

          case 10:
            return _context4.abrupt('return', _context4.sent);

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function detectMaster(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

module.exports = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(directory, options) {
    var stat, ctx;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:

            debug('aggregate context for', directory);
            _context5.prev = 1;


            if (!options) {
              options = {};
            }

            if (!(!directory || typeof directory !== 'string')) {
              _context5.next = 5;
              break;
            }

            throw new InpackError('Wrong directory passed');

          case 5:
            stat = void 0;
            _context5.prev = 6;
            _context5.next = 9;
            return fs.statAsync(directory);

          case 9:
            stat = _context5.sent;
            _context5.next = 17;
            break;

          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5['catch'](6);

            if (!(_context5.t0.code === 'ENOENT')) {
              _context5.next = 16;
              break;
            }

            throw new InpackError('Passed directory does not exist');

          case 16:
            throw new Error(_context5.t0);

          case 17:
            if (stat.isDirectory()) {
              _context5.next = 19;
              break;
            }

            throw new InpackError('Passed path is not a directory');

          case 19:
            ctx = {
              directory: directory,
              isMaster: false,
              isChild: false,
              inpack: null,
              masterConfigPath: null,
              masterPath: null
            };


            directory = resolve(directory);

            _context5.next = 23;
            return getPackageJson(directory);

          case 23:
            ctx.pkg = _context5.sent;
            _context5.next = 26;
            return isInpackJsonAccessible(directory);

          case 26:
            ctx.isMaster = _context5.sent;

            if (!ctx.isMaster) {
              _context5.next = 34;
              break;
            }

            ctx.masterPath = directory;
            _context5.next = 31;
            return getInpackJson(directory);

          case 31:
            ctx.inpack = _context5.sent;
            _context5.next = 42;
            break;

          case 34:
            if (!options.preventDetectMaster) {
              _context5.next = 38;
              break;
            }

            ctx.isChild = true;
            _context5.next = 42;
            break;

          case 38:
            _context5.next = 40;
            return detectMaster(directory);

          case 40:
            ctx.masterPath = _context5.sent;

            if (ctx.masterPath) {
              ctx.isChild = true;
            }

          case 42:
            if (!ctx.masterPath) {
              _context5.next = 52;
              break;
            }

            ctx.masterConfigPath = join(ctx.masterPath, constants.inpackConfigName);

            if (ctx.inpack) {
              _context5.next = 48;
              break;
            }

            _context5.next = 47;
            return getInpackJson(ctx.masterPath);

          case 47:
            ctx.inpack = _context5.sent;

          case 48:
            if (ctx.pkg) {
              _context5.next = 52;
              break;
            }

            _context5.next = 51;
            return getPackageJson(ctx.masterPath);

          case 51:
            ctx.pkg = _context5.sent;

          case 52:
            return _context5.abrupt('return', ctx);

          case 55:
            _context5.prev = 55;
            _context5.t1 = _context5['catch'](1);
            throw _context5.t1 instanceof Error ? _context5.t1 : new Error(_context5.t1);

          case 58:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[1, 55], [6, 12]]);
  }));

  return function (_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();