import { join } from 'path';
import test from 'ava';
import createSandbox from './utils/create-sandbox';
import Inpack from './../lib';
import fs from './../lib/utils/fs';

test('should throw exception if incorrect directory passed', async t => {

  const inpack = new Inpack();

  const failedInit = inpack.init();
  const error = await t.throws(failedInit);
  t.is(error.message, 'Incorrect directory passed: undefined');
});

test('should throw exception if incorrect directory does not contain package.json', async t => {

  const sandbox = await createSandbox({
    isMaster: false
  });

  const inpack = new Inpack();
  const failedInit = inpack.init(sandbox.path);
  const error = await t.throws(failedInit);
  t.is(error.message, 'Can not be initialized. Directory must contain package.json');

  await sandbox.remove();
});

test('should initialize new inpack project', async t => {

  const sandbox = await createSandbox({
    withoutInpack: true
  });

  const inpack = new Inpack();
  const result = await inpack.init(sandbox.path);

  t.true(typeof result.configPath === 'string');
  t.true(typeof result.inpack === 'object');

  const inpackJsonBody = await fs.readJsonAsync(result.configPath);
  t.deepEqual(inpackJsonBody, result.inpack);

  await sandbox.remove();
});

test('should initialize new inpack project with passed options', async t => {

  const sandbox = await createSandbox({
    withoutInpack: true
  });

  const inpack = new Inpack();
  const options = {
    name: 'test-inpack',
    prefix: '@test-inpack/'
  };

  const result = await inpack.init(sandbox.path, options);
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

  const inpack = new Inpack();
  const options = {
    name: 'test-inpack',
    prefix: '@test-inpack/',
    noPrefix: true
  };

  const result = await inpack.init(sandbox.path, options);
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

  const inpack = new Inpack();
  const options = {
    addPostinstall: true
  };

  const result = await inpack.init(sandbox.path, options);
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

  const inpack = new Inpack();
  const options = {
    addPostinstall: true
  };

  const result = await inpack.init(sandbox.path, options);
  t.true(typeof result.configPath === 'string');
  t.true(typeof result.inpack === 'object');

  const pkg = await fs.readJsonAsync(pkgPath);
  t.is(pkg.postinstall, 'inpack link && echo "postinstall"');

  await sandbox.remove();
});
