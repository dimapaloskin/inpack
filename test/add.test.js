/* eslint-disable */

import { tmpdir } from 'os';
import { join } from 'path';
import test from 'ava';
import sleep from 'async-sleep';
import createSandbox from './utils/create-sandbox';
import Inpack from './../lib';
import fs from './../lib/utils/fs';

test('Should throw error if master project is not found', async t => {

  const tmp = tmpdir();
  const inpack = new Inpack();
  const error = await t.throws(inpack.add(tmp));
  t.is(error.message, 'Master project is not found');

});

test('Should throw error if master project is not found', async t => {

  const sandbox = await createSandbox({
    structure: 'deep',
    isMaster: true
  });

  const inpack = new Inpack();
  const error = inpack.add(sandbox.path, 'level1');

  t.pass();
  sandbox.remove();
});
