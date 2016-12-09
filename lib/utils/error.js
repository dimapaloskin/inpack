module.exports = class InpackError extends Error {

  constructor(options) {
    super(options);
    this.type = 'inpack';
  }
};
