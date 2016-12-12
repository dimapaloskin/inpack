import { tmpdir } from 'os';
import { join, resolve } from 'path';
import test from 'ava';
import createSandbox from './utils/create-sandbox';
import Inpack from './../lib';
import fs from './../lib/utils/fs';
import { moduleSrcDirName, inpackConfigName } from './../lib/constants';

test('Should throw error if master project is not found', async t => {

  const tmp = tmpdir();
  const inpack = new Inpack();
  const error = await t.throws(inpack.add(tmp));
  t.is(error.message, 'Master project is not found');

});

test('Should throw error if module directory does not exist and create options is not passed', async t => {

  const sandbox = await createSandbox({
    structure: 'deep',
    isMaster: true
  });

  const inpack = new Inpack();
  const error = await t.throws(inpack.add(sandbox.path, 'module-does-not-exist'));
  t.is(error.message, 'Target module path does not exist. Create directory manually or use --create option');

  await sandbox.remove();

});

test('Should create and add new inpack module in the master prject when "create" option passed', async t => {

  const sandbox = await createSandbox({
    structure: 'deep',
    isMaster: true,
    noPrefix: true
  });

  const moduleName = 'module-does-not-exist';
  const inpack = new Inpack();

  await inpack.add(sandbox.path, moduleName, {
    create: true
  });

  const modulePath = join(sandbox.path, moduleName);
  const nodeModulePath = join(sandbox.path, 'node_modules', moduleName);
  const moduleDirectoryStat = await fs.statAsync(modulePath);
  const mainFileStat = await fs.statAsync(join(modulePath, 'index.js'));
  const nodeModuleStat = await fs.statAsync(nodeModulePath);
  const linkPath = await fs.readlinkAsync(join(nodeModulePath, moduleSrcDirName));
  const pkgBody = await fs.readJsonAsync(join(nodeModulePath, 'package.json'));
  const inpackJson = await fs.readJsonAsync(join(sandbox.path, inpackConfigName));

  t.true(moduleDirectoryStat.isDirectory());
  t.true(mainFileStat.isFile());
  t.true(nodeModuleStat.isDirectory());
  t.is(linkPath, resolve(modulePath));

  t.deepEqual(pkgBody, {
    name: moduleName,
    main: join(moduleSrcDirName, 'index.js'),
    inpack: true
  });

  t.deepEqual(inpackJson.modules, {
    [moduleName]: {
      path: moduleName,
      package: {
        name: moduleName,
        main: join(moduleSrcDirName, 'index.js'),
        inpack: true
      }
    }
  });

  await sandbox.remove();
});

test('Should create and add new inpack module outside master project', async t => {

  const sandbox = await createSandbox({
    structure: 'deep',
    isMaster: true,
    noPrefix: true
  });

  const moduleName = 'level1';
  const inpack = new Inpack();

  await inpack.add(join(sandbox.path, moduleName), {
    create: true
  });

  const modulePath = join(sandbox.path, moduleName);
  const nodeModulePath = join(sandbox.path, 'node_modules', moduleName);
  const moduleDirectoryStat = await fs.statAsync(modulePath);
  const mainFileStat = await fs.statAsync(join(modulePath, 'index.js'));
  const nodeModuleStat = await fs.statAsync(nodeModulePath);
  const linkPath = await fs.readlinkAsync(join(nodeModulePath, moduleSrcDirName));
  const pkgBody = await fs.readJsonAsync(join(nodeModulePath, 'package.json'));
  const inpackJson = await fs.readJsonAsync(join(sandbox.path, inpackConfigName));

  t.true(moduleDirectoryStat.isDirectory());
  t.true(mainFileStat.isFile());
  t.true(nodeModuleStat.isDirectory());
  t.is(linkPath, resolve(modulePath));

  t.deepEqual(pkgBody, {
    name: moduleName,
    main: join(moduleSrcDirName, 'index.js'),
    inpack: true
  });

  t.deepEqual(inpackJson.modules, {
    [moduleName]: {
      path: moduleName,
      package: {
        name: moduleName,
        main: join(moduleSrcDirName, 'index.js'),
        inpack: true
      }
    }
  });

  await sandbox.remove();
});
