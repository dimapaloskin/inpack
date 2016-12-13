import { basename, join } from 'path';
import test from 'ava';
import createSandbox from './utils/create-sandbox';
import Inpack from './../lib';
import fs from './../lib/utils/fs';

test('Should throw error if module was not added', async t => {

  const sandbox = await createSandbox({
    structure: 'deep',
    isMaster: true,
    noPrefix: false
  });

  const moduleRelativePath = 'level1/level2';
  const moduleName = basename(moduleRelativePath);

  const inpack = new Inpack();

  const error = await t.throws(inpack.remove(sandbox.path, moduleName));
  t.is(error.message, `${moduleName} was not found in the inpack configuration file. Use --force options to ignore it`);

  sandbox.remove();
});

test('Should try to remove module if --force passed', async t => {

  const sandbox = await createSandbox({
    structure: 'deep',
    isMaster: true,
    noPrefix: false
  });

  const moduleRelativePath = 'level1/level2';
  const moduleName = basename(moduleRelativePath);

  const inpack = new Inpack();

  const result = await inpack.remove(sandbox.path, moduleName, { force: true });
  t.is(result.name, moduleName);

  sandbox.remove();
});

test('Should remove module by name from master directory', async t => {

  const sandbox = await createSandbox({
    structure: 'deep',
    isMaster: true,
    noPrefix: false
  });

  const moduleRelativePath = 'level1/level2';
  const moduleName = basename(moduleRelativePath);
  const prefixedModuleName = `@${sandbox.id}/${moduleName}`;

  const inpack = new Inpack();
  await inpack.add(sandbox.path, moduleRelativePath);
  const nodeModulePath = join(sandbox.path, 'node_modules', prefixedModuleName);
  const stat = await fs.lstatAsync(nodeModulePath);
  t.true(stat.isDirectory());

  const result = await inpack.remove(sandbox.path, moduleName);
  const error = await t.throws(fs.lstatAsync(nodeModulePath));
  t.is(error.code, 'ENOENT');
  t.is(result.path, nodeModulePath);

  sandbox.remove();
});

test('Should remove module without passed name from child directory', async t => {

  const sandbox = await createSandbox({
    structure: 'deep',
    isMaster: true,
    noPrefix: false
  });

  const moduleRelativePath = 'level1/level2';
  const moduleName = basename(moduleRelativePath);
  const prefixedModuleName = `@${sandbox.id}/${moduleName}`;

  const inpack = new Inpack();
  await inpack.add(sandbox.path, moduleRelativePath);
  const nodeModulePath = join(sandbox.path, 'node_modules', prefixedModuleName);
  const stat = await fs.lstatAsync(nodeModulePath);
  t.true(stat.isDirectory());

  const result = await inpack.remove(join(sandbox.path, moduleRelativePath));
  const error = await t.throws(fs.lstatAsync(nodeModulePath));
  t.is(error.code, 'ENOENT');
  t.is(result.path, nodeModulePath);

  sandbox.remove();
});

test('Should remove module by name from child directory', async t => {

  const sandbox = await createSandbox({
    structure: 'deep',
    isMaster: true,
    noPrefix: false
  });

  const moduleRelativePath = 'level1/level2';
  const moduleName = basename(moduleRelativePath);
  const prefixedModuleName = `@${sandbox.id}/${moduleName}`;

  const inpack = new Inpack();
  await inpack.add(sandbox.path, moduleRelativePath);
  const nodeModulePath = join(sandbox.path, 'node_modules', prefixedModuleName);
  const stat = await fs.lstatAsync(nodeModulePath);
  t.true(stat.isDirectory());

  const result = await inpack.remove(join(sandbox.path, 'level1'), moduleName);
  const error = await t.throws(fs.lstatAsync(nodeModulePath));
  t.is(error.code, 'ENOENT');
  t.is(result.path, nodeModulePath);

  sandbox.remove();
});
