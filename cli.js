#!/usr/bin/env node

process.env.inpackCli = true;
require('babel-core/register');  // eslint-disable-line import/no-unassigned-import
const cli = require('./cli/index.js');

cli();
