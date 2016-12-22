const debug = require('debug')('inpack:main');
const InpackError = require('./utils/error');
const init = require('./commands/init');
const add = require('./commands/add');
const remove = require('./commands/remove');
const link = require('./commands/link');

class Inpack {

  constructor(options) {

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
  async init(directory, options) {

    if (!directory || typeof directory !== 'string') {
      throw new InpackError(`Wrong directory passed: ${directory}`);
    }

    try {
      return await init(directory, options);
    } catch (err) {
      throw (err instanceof Error) ? err : new Error(err);
    }
  }

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
  async add(directory, path, options) {

    if (!options && typeof path === 'object') {
      options = path;
      path = undefined;
    }

    if (!directory || typeof directory !== 'string') {
      throw new InpackError(`Wrong directory passed: ${directory}`);
    }

    try {
      return await add.call(this, directory, path, options);
    } catch (err) {
      throw (err instanceof Error) ? err : new Error(err);
    }
  }

  /**
   * Remove linked invisible module from node_modules and from inpack.json
   *
   * @param {string} directory - context directory (a directory, relative to which "remove" command will be executed)
   * @param {string} [moduleName] - name of module that should been removed
   * @param {object} [options] - options
   * @param {boolean} [options.force] - if true will try to remove directory inside node_modules even module does not saved in inpack.json
   * @return {object} - object contained module name, node_modules path and new inpack.json
   */
  async remove(directory, moduleName, options) {

    if (!options && typeof moduleName === 'object') {
      options = moduleName;
      moduleName = undefined;
    }

    if (!directory || typeof directory !== 'string') {
      throw new InpackError(`Wrong directory passed: ${directory}`);
    }

    try {
      return await remove.call(this, directory, moduleName, options);
    } catch (err) {
      throw (err instanceof Error) ? err : new Error(err);
    }
  }

  /**
   * Link all modules from inpack.json
   *
   * @param {string} directory - context directory (a directory, relative to which "link" command will be executed)
   * @return {object} - inpack configuration object and path to the inpack configuration file
   */
  async link(directory) {

    if (!directory || typeof directory !== 'string') {
      throw new InpackError(`Wrong directory passed: ${directory}`);
    }

    return await link.call(this, directory);
  }

}

module.exports = Inpack;
