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

var initHelpMessage = '';

var init = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(cli) {
    var directory, options, inpack, spinner, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            directory = cli.flags.contextDir || process.cwd();
            options = cli.flags;
            inpack = new Inpack();
            spinner = ora('Initializing new inpack project');

            spinner.start();

            _context.prev = 5;
            _context.next = 8;
            return inpack.init(directory, options);

          case 8:
            result = _context.sent;


            spinner.succeed();

            console.log(chalk.yellow('✌') + ' Done\n');
            console.log('  Project "' + chalk.magenta.bold(result.inpack.name) + '" has been successfully initialized');
            if (result.inpack.prefix) {
              console.log('  All required modules should contain "' + chalk.bold.underline(result.inpack.prefix) + '" prefix');
            }
            console.log('  Use ' + chalk.bold('inpack add <relative directory path>') + ' to add new module to the project\n');
            _context.next = 22;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context['catch'](5);

            spinner.fail();

            if (_context.t0 instanceof InpackError) {
              _context.next = 21;
              break;
            }

            throw _context.t0;

          case 21:

            console.log(chalk.red(_context.t0.message));

          case 22:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[5, 16]]);
  }));

  return function init(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = {
  init: init,
  initHelpMessage: initHelpMessage
};