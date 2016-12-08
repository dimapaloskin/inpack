const debug = require('debug')('symply:main');
const SymlyError = require('./utils/error');
const init = require('./init');

class Symly {

  constructor(options) {

    debug('construct symly');
    this.options = options || {};
    this.workingDir = process.cwd();
    this.currentDir = __dirname;
  }

  async init(options) {

    if (!options) {
      throw new SymlyError(`Incorrect options passed: ${options}`);
    }

    if (!options.directory || typeof options.directory !== 'string') {
      throw new SymlyError(`Incorrect directory passed: ${options.directory}`);
    }

    try {
      await init(options);
    } catch (err) {
      throw new Error(err);
    }
  }

}

export default Symly;
