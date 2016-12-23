'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chalk = require('chalk');
var ora = require('ora');
var Inpack = require('./../lib');
var InpackError = require('./../lib/utils/error');

var infoHelpMessage = '';

var info = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(cli, moduleName) {
    var directory, options, inpack, spinner, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            directory = cli.flags.contextDir || process.cwd();
            options = cli.flags;
            inpack = new Inpack();
            spinner = ora('Getting information for "' + moduleName + '" module');

            spinner.start();

            _context.prev = 5;
            _context.next = 8;
            return inpack.info(directory, moduleName, options);

          case 8:
            result = _context.sent;

            spinner.succeed();
            console.log('\n  Module name: ' + chalk.bold(result.name));
            if (result.name !== result.prefixedName) {
              console.log('  Prefixed module name: ' + chalk.bold(result.prefixedName));
            }
            if (result.pkgName !== result.name) {
              console.log('  Module name in package.json: ' + chalk.bold(result.pkgName));
            }

            console.log('  Main file: ' + chalk.bold(result.mainFile));
            console.log('  Relative path: ' + chalk.dim(result.relative));
            console.log('  Absolute path: ' + chalk.dim(result.absolute));
            console.log('  Master project path: ' + chalk.dim(result.masterAbsolutePath) + '\n');

            if (result.isLinked) {
              console.log('  Module "' + result.name + '" is linked to ' + chalk.dim(result.nodeModulePath) + '\n');
            } else {
              console.log('  Module "' + result.name + '" is not linked');
              console.log('  Will linked into ' + chalk.dim(result.nodeModulePath));
              console.log('  Use ' + chalk.dim('inpack link') + ' or ' + chalk.dim('inpack add ' + result.name) + ' for linking this module\n');
            }

            console.log(chalk.yellow('✌') + ' Done');
            _context.next = 27;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context['catch'](5);

            spinner.fail();

            if (_context.t0 instanceof InpackError) {
              _context.next = 26;
              break;
            }

            throw _context.t0;

          case 26:

            console.log(chalk.red(_context.t0.message));

          case 27:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[5, 21]]);
  }));

  return function info(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = {
  info: info,
  infoHelpMessage: infoHelpMessage
};