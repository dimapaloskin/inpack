'use strict';

var Promise = require('bluebird');
var fse = require('fs-extra');

var promisedFs = Promise.promisifyAll(fse);

module.exports = promisedFs;