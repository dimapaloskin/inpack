import { join } from 'path';
import test from 'ava';
import createSandbox from './utils/create-sandbox';
import init from './../lib/commands/init';
import fs from './../lib/utils/fs';

test('should throw exception if wrong directory passed', async t => {

  const failedInit = init();
  const error = await t.throws(failedInit);
  t.is(error.message, 'Wrong directory passed');
});

test('should throw exception if incorrect directory does not contain package.json', async t => {

  const sandbox = await createSandbox({
    isMaster: false
  });

  const failedInit = init(sandbox.path);
  const error = await t.throws(failedInit);
  t.is(error.message, 'Can not be initialized. The directory must contain package.json');

  await sandbox.remove();
});

test('Should initialize new inpack project', async t => {

  const sandbox = await createSandbox({
    withoutInpack: true
  });

  const result = await init(sandbox.path);

  t.true(typeof result.configPath === 'string');
  t.true(typeof result.inpack === 'object');

  const inpackJsonBody = await fs.readJsonAsync(result.configPath);
  t.deepEqual(inpackJsonBody, result.inpack);

  await sandbox.remove();
});

test('Should initialize new inpack project with passed options', async t => {

  const sandbox = await createSandbox({
    withoutInpack: true
  });

  const options = {
    name: 'test-inpack',
    prefix: '@test-inpack/'
  };

  const result = await init(sandbox.path, options);
  t.true(typeof result.configPath === 'string');
  t.true(typeof result.inpack === 'object');
  t.is(result.inpack.name, options.name);
  t.is(result.inpack.prefix, options.prefix);

  const inpackJsonBody = await fs.readJsonAsync(result.configPath);
  t.deepEqual(inpackJsonBody, result.inpack);

  await sandbox.remove();
});

test('should initialize new inpack project without prefix', async t => {

  const sandbox = await createSandbox({
    withoutInpack: true
  });

  const options = {
    name: 'test-inpack',
    prefix: false
  };

  const result = await init(sandbox.path, options);
  t.true(typeof result.configPath === 'string');
  t.true(typeof result.inpack === 'object');
  t.is(result.inpack.name, options.name);
  t.is(result.inpack.prefix, undefined);

  const inpackJsonBody = await fs.readJsonAsync(result.configPath);
  t.deepEqual(inpackJsonBody, result.inpack);

  await sandbox.remove();
});

test('should initialize new inpack project and add postinstall', async t => {

  const sandbox = await createSandbox({
    withoutInpack: true
  });

  const options = {
    addPostinstall: true
  };

  const result = await init(sandbox.path, options);
  t.true(typeof result.configPath === 'string');
  t.true(typeof result.inpack === 'object');

  const pkg = await fs.readJsonAsync(join(sandbox.path, 'package.json'));
  t.is(pkg.postinstall, 'inpack link');

  await sandbox.remove();
});

test('should initialize new inpack project and modify postinstall', async t => {

  const sandbox = await createSandbox({
    withoutInpack: true
  });

  const pkgPath = join(sandbox.path, 'package.json');
  const pkgBody = await fs.readJsonAsync(pkgPath);
  pkgBody.postinstall = 'echo "postinstall"';
  await fs.writeJsonAsync(pkgPath, pkgBody);

  const options = {
    addPostinstall: true
  };

  const result = await init(sandbox.path, options);
  t.true(typeof result.configPath === 'string');
  t.true(typeof result.inpack === 'object');

  const pkg = await fs.readJsonAsync(pkgPath);
  t.is(pkg.postinstall, 'inpack link && echo "postinstall"');

  await sandbox.remove();
});
