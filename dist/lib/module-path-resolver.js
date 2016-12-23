'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('path'),
    relative = _require.relative,
    join = _require.join;

var InpackError = require('./utils/error');
var fs = require('./utils/fs');

var modulePathResolver = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(directory, path, context) {
    var relativeModulePath, absoluteModulePath, isExists, isWritable, isReadable, stat, packageJson;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!path) {
              path = relative(context.masterPath, directory);
            }

            relativeModulePath = relative('.', path);
            absoluteModulePath = join(context.masterPath, path);
            isExists = true;
            isWritable = false;
            isReadable = false;
            _context.prev = 7;
            _context.next = 10;
            return fs.statAsync(absoluteModulePath);

          case 10:
            stat = _context.sent;

            if (stat.isDirectory()) {
              _context.next = 13;
              break;
            }

            throw new InpackError('Module path is not a directory');

          case 13:
            _context.next = 22;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context['catch'](7);

            if (!(_context.t0.code === 'ENOENT')) {
              _context.next = 21;
              break;
            }

            isExists = false;
            _context.next = 22;
            break;

          case 21:
            throw new Error(_context.t0);

          case 22:
            packageJson = {};

            if (!isExists) {
              _context.next = 51;
              break;
            }

            _context.prev = 24;
            _context.next = 27;
            return fs.readJsonAsync(join(absoluteModulePath, 'package.json'));

          case 27:
            packageJson = _context.sent;
            _context.next = 33;
            break;

          case 30:
            _context.prev = 30;
            _context.t1 = _context['catch'](24);

            packageJson = {};

          case 33:
            _context.prev = 33;
            _context.next = 36;
            return fs.accessAsync(absoluteModulePath, fs.constants.R_OK);

          case 36:
            isReadable = true;
            _context.next = 42;
            break;

          case 39:
            _context.prev = 39;
            _context.t2 = _context['catch'](33);

            isReadable = false;

          case 42:
            _context.prev = 42;
            _context.next = 45;
            return fs.accessAsync(absoluteModulePath, fs.constants.W_OK);

          case 45:
            isWritable = true;
            _context.next = 51;
            break;

          case 48:
            _context.prev = 48;
            _context.t3 = _context['catch'](42);

            isWritable = false;

          case 51:

            if ((typeof packageJson === 'undefined' ? 'undefined' : (0, _typeof3.default)(packageJson)) === 'object') {
              delete packageJson.name;
            }

            return _context.abrupt('return', {
              absolute: absoluteModulePath,
              relative: relativeModulePath,
              masterAbsolutePath: context.masterPath,
              exists: isExists,
              readable: isReadable,
              writable: isWritable,
              packageJson: packageJson
            });

          case 55:
            _context.prev = 55;
            _context.t4 = _context['catch'](0);
            throw _context.t4 instanceof Error ? _context.t4 : new Error(_context.t4);

          case 58:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 55], [7, 15], [24, 30], [33, 39], [42, 48]]);
  }));

  return function modulePathResolver(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = modulePathResolver;