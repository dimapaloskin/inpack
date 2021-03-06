import { join } from 'path';
import test from 'ava';
import createSandbox from './utils/create-sandbox';
import link from './../src/lib/commands/link';

test('Should link existing modules correct', async t => {

  const sandbox = await createSandbox({
    isMaster: false,
    structure: 'preinstalled'
  });

  const corePath = join(sandbox.path, 'core');

  const result = await link(corePath);
  t.is(result.successed.length, 3);
  t.is(result.failed.length, 0);
  const core = require(corePath); // eslint-disable-line import/no-dynamic-require

  t.deepEqual(core, {
    main: 'components/main',
    helpers: 'helpers',
    superModule: '../super-module'
  });

  sandbox.remove();
});

test('Should catch rejected', async t => {

  const sandbox = await createSandbox({
    isMaster: false,
    structure: 'preinstalled-error'
  });

  const corePath = join(sandbox.path, 'core');

  const result = await link(corePath);

  t.is(result.successed.length, 2);
  t.is(result.failed.length, 1);

  try {
    require(corePath); // eslint-disable-line import/no-dynamic-require
    t.fail('should reject');
  } catch (err) {
    t.is(err.message, `Cannot find module 'preinstalled-helpers'`);
  }

  const testPath = join(corePath, 'test');
  const testResult = require(testPath); // eslint-disable-line import/no-dynamic-require

  t.deepEqual(testResult, {
    main: 'components/main',
    superModule: '../super-module'
  });

  sandbox.remove();
});
