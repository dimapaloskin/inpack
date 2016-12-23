'use strict';

var createEmit = function createEmit(context) {

  if (context && {}.hasOwnProperty.call(context, 'emitter')) {
    return context.emitter.emit.bind(context.emitter);
  }

  return function () {};
};

module.exports = createEmit;