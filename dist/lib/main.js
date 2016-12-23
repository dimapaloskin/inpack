'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('inpack:main');
var InpackError = require('./utils/error');
var _init = require('./commands/init');
var _add = require('./commands/add');
var _remove = require('./commands/remove');
var _link = require('./commands/link');
var _info = require('./commands/info');
var _list = require('./commands/list');

var Inpack = function () {
  function Inpack(options) {
    (0, _classCallCheck3.default)(this, Inpack);


    debug('construct inpack');
    this.options = options || {};
    this.workingDir = process.cwd();
    this.currentDir = __dirname;
  }

  /**
   * Initialize new inpack master project
   *
   * @param {string} directory - directory for new inpack project
   * @param {object} [options] - project options
   * @param {string} [options.name] - inpack project name
   * @param {string} [options.prefix] - prefix for the modules created via inpack
   * @param {boolean} [options.addPostinstall] - will add or modify postinstall section in package.json if true (default: false)
   * @return {object} - inpack configuration object and path to the inpack configuration file
   */


  (0, _createClass3.default)(Inpack, [{
    key: 'init',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(directory, options) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(!directory || typeof directory !== 'string')) {
                  _context.next = 2;
                  break;
                }

                throw new InpackError('Wrong directory passed: ' + directory);

              case 2:
                _context.prev = 2;
                _context.next = 5;
                return _init(directory, options);

              case 5:
                return _context.abrupt('return', _context.sent);

              case 8:
                _context.prev = 8;
                _context.t0 = _context['catch'](2);
                throw _context.t0 instanceof Error ? _context.t0 : new Error(_context.t0);

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 8]]);
      }));

      function init(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return init;
    }()

    /**
     * Add new invisible module to inpack master project
     *
     * @param {string} directory - context directory (a directory, relative to which "add" command will be executed)
     * @param {string} [path] - realtive directory path that should be added into project
     * @param {string} [options] - options
     * @param {string} [o]ptions.name] - module name without project prefix
     * @param {string} [options.main] - main module file (like package.json option)
     * @param {string} [options.pkg] - existing package.json content (options.name and options.main will be ignored)
     * @param {boolean} [options.create] - if true will create module directory and main file if not exists (default: false)
     * @return {object} - module configuration object
     */

  }, {
    key: 'add',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(directory, path, options) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:

                if (!options && (typeof path === 'undefined' ? 'undefined' : (0, _typeof3.default)(path)) === 'object') {
                  options = path;
                  path = undefined;
                }

                if (!(!directory || typeof directory !== 'string')) {
                  _context2.next = 3;
                  break;
                }

                throw new InpackError('Wrong directory passed: ' + directory);

              case 3:
                _context2.prev = 3;
                _context2.next = 6;
                return _add.call(this, directory, path, options);

              case 6:
                return _context2.abrupt('return', _context2.sent);

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2['catch'](3);
                throw _context2.t0 instanceof Error ? _context2.t0 : new Error(_context2.t0);

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 9]]);
      }));

      function add(_x3, _x4, _x5) {
        return _ref2.apply(this, arguments);
      }

      return add;
    }()

    /**
     * Remove linked invisible module from node_modules and from inpack.json
     *
     * @param {string} directory - context directory (a directory, relative to which "remove" command will be executed)
     * @param {string} [moduleName] - name of module that should been removed
     * @param {object} [options] - options
     * @param {boolean} [options.force] - if true will try to remove directory inside node_modules even module does not saved in inpack.json
     * @return {object} - object contained module name, node_modules path and new inpack.json
     */

  }, {
    key: 'remove',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(directory, moduleName, options) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:

                if (!options && (typeof moduleName === 'undefined' ? 'undefined' : (0, _typeof3.default)(moduleName)) === 'object') {
                  options = moduleName;
                  moduleName = undefined;
                }

                if (!(!directory || typeof directory !== 'string')) {
                  _context3.next = 3;
                  break;
                }

                throw new InpackError('Wrong directory passed: ' + directory);

              case 3:
                _context3.prev = 3;
                _context3.next = 6;
                return _remove.call(this, directory, moduleName, options);

              case 6:
                return _context3.abrupt('return', _context3.sent);

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3['catch'](3);
                throw _context3.t0 instanceof Error ? _context3.t0 : new Error(_context3.t0);

              case 12:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 9]]);
      }));

      function remove(_x6, _x7, _x8) {
        return _ref3.apply(this, arguments);
      }

      return remove;
    }()

    /**
     * Link all modules from inpack.json
     *
     * @param {string} directory - context directory (a directory, relative to which "link" command will be executed)
     * @return {object} - inpack configuration object and path to the inpack configuration file
     */

  }, {
    key: 'link',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(directory) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(!directory || typeof directory !== 'string')) {
                  _context4.next = 2;
                  break;
                }

                throw new InpackError('Wrong directory passed: ' + directory);

              case 2:
                _context4.next = 4;
                return _link.call(this, directory);

              case 4:
                return _context4.abrupt('return', _context4.sent);

              case 5:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function link(_x9) {
        return _ref4.apply(this, arguments);
      }

      return link;
    }()

    /**
     * Provide information about module
     *
     * @param {string} directory - context directory (a directory, relative to which "info" command will be executed)
     * @param {string} moduleName - name of module
     *
     * @return {object}
     */

  }, {
    key: 'info',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(directory, moduleName) {
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(!directory || typeof directory !== 'string')) {
                  _context5.next = 2;
                  break;
                }

                throw new InpackError('Incorrect directory passed: ' + directory);

              case 2:
                _context5.next = 4;
                return _info.call(this, directory, moduleName);

              case 4:
                return _context5.abrupt('return', _context5.sent);

              case 5:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function info(_x10, _x11) {
        return _ref5.apply(this, arguments);
      }

      return info;
    }()

    /**
     * Provide information about all modules
     *
     * @param {string} directory - context directory (a directory, relative to which "info" command will be executed)
     *
     * @return {object}
     */

  }, {
    key: 'list',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(directory) {
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!(!directory || typeof directory !== 'string')) {
                  _context6.next = 2;
                  break;
                }

                throw new InpackError('Incorrect directory passed: ' + directory);

              case 2:
                _context6.next = 4;
                return _list.call(this, directory);

              case 4:
                return _context6.abrupt('return', _context6.sent);

              case 5:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function list(_x12) {
        return _ref6.apply(this, arguments);
      }

      return list;
    }()
  }]);
  return Inpack;
}();

module.exports = Inpack;