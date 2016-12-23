'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('path'),
    join = _require.join,
    basename = _require.basename,
    resolve = _require.resolve;

var slash = require('slash');
var InpackError = require('./../utils/error');
var fs = require('./../utils/fs');
var aggregateContext = require('./../aggregate-context');
var modulePathResolver = require('./../module-path-resolver');

var _require2 = require('./../constants'),
    defaultModuleOptions = _require2.defaultModuleOptions,
    moduleSrcDirName = _require2.moduleSrcDirName;

var createEmit = require('./../utils/create-emit');

var add = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(directory, path, options) {
    var emit, context, resolvedModule, inpackJson, prefix, moduleName, prefixedModuleName, nodeModulePath, mainFilePath, pkgBody, destination, inpackModule;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            emit = createEmit(this);


            if (!options && (typeof path === 'undefined' ? 'undefined' : (0, _typeof3.default)(path)) === 'object') {
              options = path;
              path = undefined;
            }

            if (!isNaN(parseFloat(path)) && isFinite(path)) {
              path = path.toString();
            }

            if (!options) {
              options = {};
            }

            options = (0, _extends3.default)({}, defaultModuleOptions, options);

            _context.next = 8;
            return aggregateContext(directory);

          case 8:
            context = _context.sent;

            if (!(!context.masterConfigPath || !context.masterPath)) {
              _context.next = 11;
              break;
            }

            throw new InpackError('Master project has not been found');

          case 11:
            if (!(resolve(context.masterPath) === resolve(directory) && !path && !options.name)) {
              _context.next = 13;
              break;
            }

            throw new InpackError('You cannot add master project to master project. If you want, you can use --name');

          case 13:

            emit('add:context', context);

            _context.next = 16;
            return modulePathResolver(directory, path, context);

          case 16:
            resolvedModule = _context.sent;
            _context.next = 19;
            return fs.readJsonAsync(context.masterConfigPath);

          case 19:
            inpackJson = _context.sent;
            prefix = inpackJson.prefix || '';
            moduleName = options.name || basename(resolvedModule.absolute);
            prefixedModuleName = '' + prefix + moduleName;
            nodeModulePath = join(resolvedModule.masterAbsolutePath, 'node_modules', prefixedModuleName);

            emit('add:module-names', { name: moduleName, prefixed: prefixedModuleName });

            if (!(inpackJson.modules && inpackJson.modules[moduleName] && inpackJson.modules[moduleName].path !== resolvedModule.relative)) {
              _context.next = 27;
              break;
            }

            throw new InpackError(moduleName + ' is already linked with another module. Remove previous module at first');

          case 27:
            if (!(!resolvedModule.exists && !options.create)) {
              _context.next = 29;
              break;
            }

            throw new InpackError('Target path ' + resolvedModule.absolute + ' for module "' + resolvedModule.relative + '" does not exist. Create directory manually or use --create option');

          case 29:
            if (!(!resolvedModule.exists && options.create)) {
              _context.next = 35;
              break;
            }

            _context.next = 32;
            return fs.mkdirpAsync(resolvedModule.absolute);

          case 32:
            mainFilePath = join(resolvedModule.absolute, options.main);
            _context.next = 35;
            return fs.writeFileAsync(mainFilePath, '');

          case 35:
            _context.next = 37;
            return fs.mkdirp(nodeModulePath);

          case 37:

            //  generate module package.json
            //  merge options, previously generated package.json and
            //  module's package.json (if exists)
            options.pkg = options.pkg || {
              name: prefixedModuleName,
              main: slash(join(moduleSrcDirName, options.main))
            };

            if (resolvedModule.packageJson && typeof resolvedModule.packageJson.main === 'string') {
              resolvedModule.packageJson.main = slash(join(moduleSrcDirName, resolvedModule.packageJson.main));
            }

            pkgBody = (0, _extends3.default)({}, options.pkg, resolvedModule.packageJson);

            pkgBody = (0, _extends3.default)({}, pkgBody, { inpack: true });

            destination = resolve(join(nodeModulePath, moduleSrcDirName));
            _context.next = 44;
            return fs.removeAsync(destination);

          case 44:

            emit('add:link', {
              relative: resolvedModule.relative,
              absolute: resolvedModule.absolute,
              destination: destination
            });

            _context.next = 47;
            return fs.ensureSymlinkAsync(resolvedModule.absolute, destination);

          case 47:
            _context.next = 49;
            return fs.writeJsonAsync(join(nodeModulePath, 'package.json'), pkgBody);

          case 49:

            if (!inpackJson.modules) {
              inpackJson.modules = {};
            }

            inpackModule = {
              path: slash(resolvedModule.relative),
              name: moduleName,
              package: pkgBody
            };


            inpackJson.modules[moduleName] = inpackModule;

            if (options.silent) {
              _context.next = 55;
              break;
            }

            _context.next = 55;
            return fs.writeJsonAsync(context.masterConfigPath, inpackJson);

          case 55:
            return _context.abrupt('return', inpackModule);

          case 58:
            _context.prev = 58;
            _context.t0 = _context['catch'](0);
            throw _context.t0 instanceof Error || _context.t0 instanceof InpackError ? _context.t0 : new Error(_context.t0);

          case 61:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 58]]);
  }));

  return function add(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = add;