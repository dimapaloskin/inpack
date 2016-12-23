'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('path'),
    join = _require.join,
    relative = _require.relative;

var slash = require('slash');
var aggregateContext = require('./../aggregate-context');
var modulePathResolver = require('./../module-path-resolver');

var _require2 = require('./../constants'),
    moduleSrcDirName = _require2.moduleSrcDirName;

var InpackError = require('./../utils/error');
var fs = require('./../utils/fs');

var info = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(directory, moduleName) {
    var _this = this;

    var _ret;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            return _context2.delegateYield(_regenerator2.default.mark(function _callee() {
              var context, modules, result, module, resolvedModule, nodeModuleSrcPath, isLinked, link;
              return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return aggregateContext(directory);

                    case 2:
                      context = _context.sent;

                      if (context.masterPath) {
                        _context.next = 5;
                        break;
                      }

                      throw new InpackError('Master project has not been found');

                    case 5:
                      modules = context.inpack.modules;

                      if (!moduleName) {
                        (function () {
                          var relativePath = slash(relative(context.masterPath, directory));
                          moduleName = Object.keys(modules).find(function (name) {
                            return modules[name].path === relativePath;
                          });
                        })();
                      }

                      result = {};
                      module = modules[moduleName];

                      if (!((typeof module === 'undefined' ? 'undefined' : (0, _typeof3.default)(module)) !== 'object')) {
                        _context.next = 11;
                        break;
                      }

                      throw new InpackError('Inpack configuration does not contain information about ' + moduleName + ' module');

                    case 11:
                      _context.next = 13;
                      return modulePathResolver(directory, module.path, context);

                    case 13:
                      resolvedModule = _context.sent;


                      result.masterAbsolutePath = resolvedModule.masterAbsolutePath;
                      result.relative = resolvedModule.relative;
                      result.absolute = resolvedModule.absolute;
                      result.name = module.name;
                      result.pkgName = module.package.name;
                      result.prefixedName = (context.inpack.prefix || '') + module.name;
                      result.mainFile = module.package.main.startsWith(moduleSrcDirName) ? module.package.main.substr(moduleSrcDirName.length + 1) : module.package.main;

                      nodeModuleSrcPath = join(result.masterAbsolutePath, 'node_modules', result.prefixedName, moduleSrcDirName);
                      isLinked = true;
                      _context.prev = 23;
                      _context.next = 26;
                      return fs.readlinkAsync(nodeModuleSrcPath);

                    case 26:
                      link = _context.sent;

                      if (link !== result.absolute) {
                        isLinked = false;
                      }
                      _context.next = 33;
                      break;

                    case 30:
                      _context.prev = 30;
                      _context.t0 = _context['catch'](23);

                      isLinked = false;

                    case 33:

                      result.nodeModulePath = join(result.masterAbsolutePath, 'node_modules', result.prefixedName);
                      result.isLinked = isLinked;

                      return _context.abrupt('return', {
                        v: result
                      });

                    case 36:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this, [[23, 30]]);
            })(), 't0', 2);

          case 2:
            _ret = _context2.t0;

            if (!((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object")) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt('return', _ret.v);

          case 5:
            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t1 = _context2['catch'](0);
            throw _context2.t1 instanceof Error || _context2.t1 instanceof InpackError ? _context2.t1 : new Error(_context2.t1);

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 7]]);
  }));

  return function info(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = info;