#!/usr/bin/env node

process.env.inpackCli = true;
const cli = require('./dist/cli/index.js');

cli();
