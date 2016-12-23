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

var listHelpMessage = '';

var list = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(cli) {
    var directory, options, emitter, inpack, boundList, spinner, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            directory = cli.flags.contextDir || process.cwd();
            options = cli.flags;
            emitter = new EventEmitter();
            inpack = new Inpack();
            boundList = inpack.list.bind({ emitter: emitter });
            spinner = ora('Searching for master project');

            spinner.start();

            emitter.on('info:context', function (data) {
              spinner.text = 'Master project has been found in ' + chalk.dim(data.masterPath);
              spinner.succeed();
              spinner.text = 'Collect information';
              spinner.start();
            });

            emitter.on('list:info:module', function (name) {
              spinner.text = 'Get information about "' + name + '" module';
            });

            emitter.on('list:info:end', function (_ref2) {
              var successed = _ref2.successed,
                  failed = _ref2.failed;

              spinner.text = 'Collected information for ' + chalk.bold(successed) + ' modules. ' + chalk.bold(failed) + ' failed.\n';
            });

            _context.prev = 10;
            _context.next = 13;
            return boundList(directory, options);

          case 13:
            result = _context.sent;

            spinner.succeed();

            result.successed.forEach(function (module) {

              if (options.verbose) {
                console.log('  Module name: ' + chalk.bold(module.name));
                if (module.name !== module.prefixedName) {
                  console.log('  Prefixed module name: ' + chalk.bold(module.prefixedName));
                }
                if (module.pkgName !== module.name) {
                  console.log('  Module name in package.json: ' + chalk.bold(module.pkgName));
                }

                console.log('  Main file: ' + chalk.bold(module.mainFile));
                console.log('  Relative path: ' + chalk.dim(module.relative));
                console.log('  Absolute path: ' + chalk.dim(module.absolute));
                console.log('  Master project path: ' + chalk.dim(module.masterAbsolutePath) + '\n');

                if (module.isLinked) {
                  console.log('  Module "' + module.name + '" is linked to ' + chalk.dim(module.nodeModulePath) + '\n');
                } else {
                  console.log('  Module "' + module.name + '" is not linked');
                  console.log('  Will linked into ' + chalk.dim(module.nodeModulePath));
                  console.log('  Use ' + chalk.dim('inpack link') + ' or ' + chalk.dim('inpack add ' + module.name) + ' for linking this module\n');
                }
              } else {
                console.log('  Module name: ' + chalk.bold(module.name) + '. Relative path: ' + chalk.dim(module.relative) + '. Absolute path: ' + chalk.dim(module.absolute));
              }
            });

            result.failed.forEach(function (module) {
              if (module.reason instanceof InpackError) {
                var errorMessage = chalk.red(module.reason.message);
                console.error('  ' + errorMessage);
              } else {
                throw module.reason;
              }
            });

            console.log('\n ' + chalk.yellow('✌') + ' Done');
            _context.next = 26;
            break;

          case 20:
            _context.prev = 20;
            _context.t0 = _context['catch'](10);

            spinner.fail();

            if (_context.t0 instanceof InpackError) {
              _context.next = 25;
              break;
            }

            throw _context.t0;

          case 25:

            console.log(chalk.red(_context.t0.message));

          case 26:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[10, 20]]);
  }));

  return function list(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = {
  list: list,
  listHelpMessage: listHelpMessage
};