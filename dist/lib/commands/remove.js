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
    basename = _require.basename,
    join = _require.join;

var aggregateContext = require('./../aggregate-context');
var InpackError = require('./../utils/error');
var fs = require('./../utils/fs');
var createEmit = require('./../utils/create-emit');

var remove = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(directory, moduleName, options) {
    var emit, context, inpackJson, extractedModuleData, prefixedName, nodeModulePath;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            emit = createEmit(this);


            if (!options && (typeof moduleName === 'undefined' ? 'undefined' : (0, _typeof3.default)(moduleName)) === 'object') {
              options = moduleName;
              moduleName = undefined;
            }

            if (!options) {
              options = {};
            }

            _context.next = 6;
            return aggregateContext(directory);

          case 6:
            context = _context.sent;

            if (!(!context.masterConfigPath || !context.masterPath)) {
              _context.next = 9;
              break;
            }

            throw new InpackError('Master project has not been found');

          case 9:

            emit('remove:context', context);

            if (!moduleName) {
              moduleName = basename(relative(context.masterPath, directory));
            }

            _context.next = 13;
            return fs.readJsonAsync(context.masterConfigPath);

          case 13:
            inpackJson = _context.sent;
            extractedModuleData = inpackJson.modules && inpackJson.modules[moduleName] ? inpackJson.modules[moduleName] : undefined;

            if (!(!extractedModuleData && !options.force)) {
              _context.next = 17;
              break;
            }

            throw new InpackError(moduleName + ' was not found in the inpack configuration file. Use --force option to ignore it');

          case 17:
            prefixedName = '' + (inpackJson.prefix || '') + moduleName;
            nodeModulePath = join(context.masterPath, 'node_modules', prefixedName);
            _context.next = 21;
            return fs.removeAsync(nodeModulePath);

          case 21:
            if (!extractedModuleData) {
              _context.next = 25;
              break;
            }

            delete inpackJson.modules[moduleName];
            _context.next = 25;
            return fs.writeJsonAsync(context.masterConfigPath, inpackJson);

          case 25:
            return _context.abrupt('return', {
              name: moduleName,
              path: nodeModulePath,
              inpack: inpackJson
            });

          case 28:
            _context.prev = 28;
            _context.t0 = _context['catch'](0);
            throw _context.t0 instanceof Error || _context.t0 instanceof InpackError ? _context.t0 : new Error(_context.t0);

          case 31:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 28]]);
  }));

  return function remove(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = remove;