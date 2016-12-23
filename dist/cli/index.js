'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var meow = require('meow');
var chalk = require('chalk');
var pkg = require('./../../package.json');

var _require = require('./init'),
    init = _require.init;

var _require2 = require('./add'),
    add = _require2.add;

var _require3 = require('./remove'),
    remove = _require3.remove;

var _require4 = require('./link'),
    link = _require4.link;

var _require5 = require('./info'),
    info = _require5.info;

var _require6 = require('./list'),
    list = _require6.list;

module.exports = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
  var cli, availableCommads, inputs, command;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          cli = meow('\n\n    inpack - nodejs invisible modules manager\n\n    Usage: inpack <command>\n\n    Available commands:\n\n      ' + chalk.bold('help') + ' - show this text\n      ' + chalk.bold('init') + ' - initialize new inpack master project\n      ' + chalk.bold('add') + ' <relative/path> - add directory as a module\n      ' + chalk.bold('remove') + ' <module_name> - remove module\n      ' + chalk.bold('link') + ' - link all modules from inpack.json\n      ' + chalk.bold('info') + ' <module_name> - show inforamtion about module\n      ' + chalk.bold('list') + ' - provide information about all modules\n\n    Use help <command> to get more information about <command>\n\n    inpack@' + pkg.version, {
            boolean: 'create'
          });
          availableCommads = ['add', 'remove', 'link', 'init', 'info', 'resolve', 'list'];
          inputs = cli.input;
          command = inputs.shift();


          if (!command) {
            cli.showHelp();
          }

          if (command === 'help' && inputs.length === 0) {
            cli.showHelp();
          }

          if (!availableCommads.includes(command)) {
            console.log('\n  Command "' + command + '" is not recognized');
            cli.showHelp();
          }

          if (command === 'init') {
            init(cli);
          }

          if (command === 'add') {
            add(cli, inputs);
          }

          if (command === 'remove') {
            remove(cli, inputs[0]);
          }

          if (command === 'link') {
            link(cli);
          }

          if (command === 'info' || command === 'resolve') {
            info(cli, inputs[0]);
          }

          if (command === 'list') {
            list(cli);
          }

          // console.log(cli);

        case 13:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}));