const createEmit = context => {

  if (context && {}.hasOwnProperty.call(context, 'emitter')) {
    return context.emitter.emit.bind(context.emitter);
  }

  return () => {};
};

module.exports = createEmit;
