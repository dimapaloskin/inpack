const Promise = require('bluebird');
const fse = require('fs-extra');

const promisedFs = Promise.promisifyAll(fse);

module.exports = promisedFs;
