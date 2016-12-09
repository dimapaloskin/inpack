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

  async init(options) {

    if (!options) {
      throw new InpackError(`Incorrect options passed: ${options}`);
    }

    if (!options.directory || typeof options.directory !== 'string') {
      throw new InpackError(`Incorrect directory passed: ${options.directory}`);
    }

    try {
      await init(options);
    } catch (err) {
      throw new Error(err);
    }
  }

}

export default Inpack;
