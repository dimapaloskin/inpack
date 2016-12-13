const aggregateContext = require('./../aggregate-context');
const InpackError = require('./../utils/error');

const link = async directory => {

  const context = aggregateContext(directory);

  if (!context.isMaster) {
    throw new InpackError('Current directory is not the inpack master project');
  }

  return directory;
};

module.exports = link;
