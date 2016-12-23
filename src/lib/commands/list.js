const Promise = require('bluebird');
const aggregateContext = require('./../aggregate-context');
const info = require('./info');
const InpackError = require('./../utils/error');
const createEmit = require('./../utils/create-emit');

const list = async function (directory) {

  try {

    const emit = createEmit(this);

    const context = await aggregateContext(directory);

    if (!context.masterPath) {
      throw new InpackError('Master project has not been found');
    }

    emit('info:context', context);

    const modules = context.inpack.modules;

    const result = await Promise.map(Object.keys(modules), async name => {
      emit('list:info:module', name);
      const module = modules[name];

      const result = {
        isRejected: false,
        isFulfilled: false
      };

      try {
        result.value = await info(directory, name);
        result.isFulfilled = true;
      } catch (err) {
        result.isRejected = true;
        result.reason = err;
        result.module = module;
      }

      return result;

    }, { concurrency: 10 });

    const successed = result.filter(({ isFulfilled }) => isFulfilled === true)
      .map(({ value }) => value);
    const failed = result.filter(({ isRejected }) => isRejected === true)
      .map(({ reason, module }) => ({ reason, module }));

    emit('list:info:end', { successed: successed.length, failed: failed.length });

    return { successed, failed };
  } catch (err) {
    throw (err instanceof Error || err instanceof InpackError) ? err : new Error(err);
  }
};

module.exports = list;
