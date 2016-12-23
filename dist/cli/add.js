'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventEmitter = require('events');
var chalk = require('chalk');
var ora = require('ora');
var Inpack = require('./../lib');
var InpackError = require('./../lib/utils/error');

var addHelpMessage = '';

var add = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(cli, inputs) {
    var directory, options, emitter, inpack, boundAdd, modulePath, spinner;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            directory = cli.flags.contextDir || process.cwd();
            options = cli.flags;
            emitter = new EventEmitter();
            inpack = new Inpack();
            boundAdd = inpack.add.bind({ emitter: emitter });
            modulePath = inputs[0];
            spinner = ora('Searcing for master project');

            spinner.start();

            emitter.on('add:module-names', function (data) {
              spinner.succeed();
              spinner.text = 'Adding "' + chalk.bold(data.name) + '" as "' + chalk.bold.underline(data.prefixed) + '"';
              spinner.start();
            });

            emitter.on('add:context', function (data) {
              spinner.text = 'Master project has been found in ' + chalk.dim(data.masterPath) + ' ';
              spinner.succeed();
              spinner.text = 'Preparing';
              spinner.start();
            });

            _context.prev = 10;
            _context.next = 13;
            return boundAdd(directory, modulePath, options);

          case 13:
            spinner.succeed();
            console.log(chalk.yellow('✌') + ' Done');
            _context.next = 23;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context['catch'](10);

            spinner.fail();

            if (_context.t0 instanceof InpackError) {
              _context.next = 22;
              break;
            }

            throw _context.t0;

          case 22:

            console.log(chalk.red(_context.t0.message));

          case 23:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[10, 17]]);
  }));

  return function add(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = {
  add: add,
  addHelpMessage: addHelpMessage
};