module.exports = class SymlyError extends Error {

  constructor(options) {
    super(options);
    this.type = 'symly';
  }
};
