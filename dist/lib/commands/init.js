'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('path'),
    join = _require.join,
    basename = _require.basename;

var aggregateContext = require('./../aggregate-context');
var fs = require('./../utils/fs');
var constants = require('./../constants');
var InpackError = require('./../utils/error');

var getInstallCommand = function getInstallCommand(previous) {

  var command = previous;
  if (!command) {
    command = constants.postinstallCommand;
  } else if (typeof command === 'string' && !command.startsWith(constants.postinstallCommand)) {
    command = constants.postinstallCommand + ' && ' + command;
  }

  return command;
};

var init = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(directory) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : constants.defaultInpackOptions;
    var context, projectDirectoryName, inpackConfigPath, inpackJson, pkgPath, pkg, postinstall;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return aggregateContext(directory, { preventDetectMaster: true });

          case 3:
            context = _context.sent;

            if (context.pkg) {
              _context.next = 6;
              break;
            }

            throw new InpackError('Can not be initialized. The directory must contain package.json');

          case 6:
            projectDirectoryName = basename(directory);
            inpackConfigPath = join(context.directory, constants.inpackConfigName);
            inpackJson = {};

            if (!context.isMaster) {
              _context.next = 13;
              break;
            }

            _context.next = 12;
            return fs.readJsonAsync(inpackConfigPath);

          case 12:
            inpackJson = _context.sent;

          case 13:

            inpackJson.name = options.name || inpackJson.name || projectDirectoryName;
            inpackJson.prefix = options.prefix || inpackJson.prefix;

            if (!options.prefix) {
              delete inpackJson.prefix;
            }

            if (!{}.hasOwnProperty.call(inpackJson, 'modules')) {
              inpackJson.modules = {};
            }

            _context.next = 19;
            return fs.writeJsonAsync(inpackConfigPath, inpackJson);

          case 19:
            if (!options.addPostinstall) {
              _context.next = 28;
              break;
            }

            pkgPath = join(directory, 'package.json');
            _context.next = 23;
            return fs.readJsonAsync(pkgPath);

          case 23:
            pkg = _context.sent;
            postinstall = pkg.postinstall;


            pkg.postinstall = getInstallCommand(postinstall);
            _context.next = 28;
            return fs.writeJsonAsync(pkgPath, pkg);

          case 28:
            return _context.abrupt('return', {
              inpack: inpackJson,
              configPath: inpackConfigPath
            });

          case 31:
            _context.prev = 31;
            _context.t0 = _context['catch'](0);
            throw _context.t0 instanceof Error || _context.t0 instanceof InpackError ? _context.t0 : new Error(_context.t0);

          case 34:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 31]]);
  }));

  return function init(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = init;