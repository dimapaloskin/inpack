const debug = require('debug')('symply:main');
const aggregateContext = require('./aggregate-context');

class Symly {

  constructor(options) {

    debug('Initialize symply');
    this.options = options || {};
    this.options.workingDir = options || process.cwd();
  }

  async init() {
    const context = aggregateContext({
      workingDir: {} // this.options.workingDir
    });
    return context;
  }

}

export default Symly;
