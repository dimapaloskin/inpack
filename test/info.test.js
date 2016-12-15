import { join, resolve } from 'path';
import test from 'ava';
import createSandbox from './utils/create-sandbox';
import link from './../lib/commands/link';
import info from './../lib/commands/info';

test('should throw error if module does not found', async t => {

  const sandbox = await createSandbox({
    isMaster: false,
    structure: 'preinstalled'
  });

  const corePath = join(sandbox.path, 'core');
  await link(corePath);

  const error = await t.throws(info(corePath, 'nonexistent-module'));
  t.is(error.message, 'Inpack configuration does not contain information about nonexistent-module module');

  sandbox.remove();
});

test('should provide module info by name from master directory', async t => {

  const sandbox = await createSandbox({
    isMaster: false,
    structure: 'preinstalled'
  });

  const corePath = join(sandbox.path, 'core');

  await link(corePath);
  const result = await info(corePath, 'super-module');

  t.deepEqual(result, {
    masterAbsolutePath: corePath,
    relative: '../super-module',
    absolute: resolve(corePath, '../super-module'),
    name: 'super-module',
    prefixedName: 'preinstalled-super-module',
    mainFile: 'index.js',
    isLinked: true
  });

  sandbox.remove();
});

test('should provide module info from module directory', async t => {

  const sandbox = await createSandbox({
    isMaster: false,
    structure: 'preinstalled'
  });

  const corePath = join(sandbox.path, 'core');
  const modulePath = join(corePath, 'components/main');

  await link(corePath);
  const result = await info(modulePath);

  t.deepEqual(result, {
    masterAbsolutePath: corePath,
    relative: 'components/main',
    absolute: modulePath,
    name: 'main',
    prefixedName: 'preinstalled-main',
    mainFile: 'index.js',
    isLinked: true
  });

  sandbox.remove();
});
