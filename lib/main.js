const debug = require('debug')('inpack:main');
const InpackError = require('./utils/error');
const init = require('./init');

class Inpack {

  constructor(options) {

    debug('construct inpack');
    this.options = options || {};
    this.workingDir = process.cwd();
    this.currentDir = __dirname;
  }

  /**
   * Initialize new inpack project
   *
   * @param {string} directory - directory for new inpack project
   * @param {object} options - project options
   * @param {string} options.name - inpack project name
   * @param {string} options.prefix - prefix for the modules created via inpack
   * @param {boolean} options.addPostinstall - will add or modify postinstall section in package.json if true
   * @return {object}
   */
  async init(directory, options) {

    if (!directory || typeof directory !== 'string') {
      throw new InpackError(`Incorrect directory passed: ${directory}`);
    }

    try {
      return await init(directory, options);
    } catch (err) {
      throw (err instanceof Error) ? err : new Error(err);
    }
  }

}

export default Inpack;
