const aggregateContext = require('./aggregate-context');

const init = async ({ directory }) => {

  try {
    const context = await aggregateContext({ directory });

    return context;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = init;
