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

var linkHelpMessage = '';

var link = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(cli) {
    var directory, emitter, inpack, boundLink, spinner, result, errorMessage;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            directory = cli.flags.contextDir || process.cwd();
            emitter = new EventEmitter();
            inpack = new Inpack();
            boundLink = inpack.link.bind({ emitter: emitter });
            spinner = ora('Searching for master project');

            spinner.start();

            emitter.on('link:context', function (data) {
              spinner.text = 'Master project has been found in ' + chalk.dim(data.masterPath);
              spinner.succeed();
              spinner.text = 'Getting modules';
              spinner.start();
            });

            emitter.on('link:modules', function (data) {
              spinner.text = Object.keys(data).length + ' modules have been found';
            });

            emitter.on('link:module', function (name) {
              spinner.text = 'Linking ' + name + ' module';
            });

            emitter.on('link:modules:end', function () {
              spinner.text = 'All modules have been linked';
              spinner.succeed();
            });

            _context.prev = 10;
            _context.next = 13;
            return boundLink(directory);

          case 13:
            result = _context.sent;


            console.log('\n  Successed: ' + chalk.bold(result.successed.length) + '. Failed: ' + chalk.bold(result.failed.length));

            result.failed.forEach(function (module) {
              if (module.reason instanceof InpackError) {
                var errorMessage = chalk.red(module.reason.message);
                console.error('  ' + errorMessage);
              } else {
                throw module.reason;
              }
            });

            console.log('\n' + chalk.yellow('✌') + ' Done');
            _context.next = 26;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context['catch'](10);

            spinner.fail();

            if (!(!(_context.t0 instanceof InpackError) || !_context.t0.message)) {
              _context.next = 24;
              break;
            }

            throw _context.t0;

          case 24:
            errorMessage = chalk.red(_context.t0.message);

            console.error(errorMessage);

          case 26:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[10, 19]]);
  }));

  return function link(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = {
  link: link,
  linkHelpMessage: linkHelpMessage
};