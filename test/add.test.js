import { tmpdir } from 'os';
import { posix } from 'path';
import test from 'ava';
import createSandbox from './utils/create-sandbox';
import Inpack from './../lib';
import fs from './../lib/utils/fs';
import { moduleSrcDirName, inpackConfigName } from './../lib/constants';

const { join, resolve } = posix;

const compileModuleInfo = async (sandboxPath, moduleName, mainFile = 'index.js', prefix = '') => {

  // absolute module path (technically it is should support symlinks too)
  const modulePath = join(sandboxPath, moduleName);
  // absolute path to module that will created in the node_modules directory
  const nodeModulePath = join(sandboxPath, 'node_modules', `${prefix}${moduleName}`);
  const realDirectoryStat = await fs.statAsync(modulePath);
  const mainFileStat = await fs.statAsync(join(modulePath, mainFile));
  const nodeModuleDirectoryStat = await fs.statAsync(nodeModulePath);
  const symlink = await fs.readlinkAsync(join(nodeModulePath, moduleSrcDirName));
  const pkg = await fs.readJsonAsync(join(nodeModulePath, 'package.json'));
  const inpack = await fs.readJsonAsync(join(sandboxPath, inpackConfigName));

  return {
    modulePath,
    nodeModulePath,
    realDirectoryStat,
    mainFileStat,
    nodeModuleDirectoryStat,
    symlink,
    pkg,
    inpack
  };
};

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

  const compiled = await compileModuleInfo(sandbox.path, moduleName);

  t.true(compiled.realDirectoryStat.isDirectory());
  t.true(compiled.mainFileStat.isFile());
  t.true(compiled.nodeModuleDirectoryStat.isDirectory());
  t.is(compiled.symlink, resolve(compiled.modulePath));

  t.deepEqual(compiled.pkg, {
    name: moduleName,
    main: join(moduleSrcDirName, 'index.js'),
    inpack: true
  });

  t.deepEqual(compiled.inpack.modules, {
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

test('Should create and add new inpack module outside master project. should add module the same module twice without errors', async t => {

  const sandbox = await createSandbox({
    structure: 'deep',
    isMaster: true,
    noPrefix: true
  });

  const moduleName = 'level1';
  const inpack = new Inpack();

  await inpack.add(join(sandbox.path, moduleName));
  // tests adding the same module several times
  await inpack.add(join(sandbox.path, moduleName));

  const compiled = await compileModuleInfo(sandbox.path, moduleName);

  t.true(compiled.realDirectoryStat.isDirectory());
  t.true(compiled.mainFileStat.isFile());
  t.true(compiled.nodeModuleDirectoryStat.isDirectory());
  t.is(compiled.symlink, resolve(compiled.modulePath));

  t.deepEqual(compiled.pkg, {
    name: moduleName,
    main: join(moduleSrcDirName, 'index.js'),
    inpack: true
  });

  t.deepEqual(compiled.inpack.modules, {
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

test('Should rewrite existing module with custom main file name', async t => {
  const sandbox = await createSandbox({
    structure: 'with-existing-modules',
    isMaster: true,
    noPrefix: true
  });

  const moduleName = 'existing-module';
  const inpack = new Inpack();

  await inpack.add(join(sandbox.path), moduleName, {
    main: 'component.js'
  });

  const compiled = await compileModuleInfo(sandbox.path, moduleName, 'component.js');

  t.true(compiled.realDirectoryStat.isDirectory());
  t.true(compiled.mainFileStat.isFile());
  t.true(compiled.nodeModuleDirectoryStat.isDirectory());
  t.is(compiled.symlink, resolve(compiled.modulePath));

  t.deepEqual(compiled.pkg, {
    name: moduleName,
    main: join(moduleSrcDirName, 'component.js'),
    inpack: true
  });

  t.deepEqual(compiled.inpack.modules, {
    [moduleName]: {
      path: moduleName,
      package: {
        name: moduleName,
        main: join(moduleSrcDirName, 'component.js'),
        inpack: true
      }
    }
  });

  await sandbox.remove();
});

test('Should add correct  module with prefix', async t => {
  const sandbox = await createSandbox({
    structure: 'with-existing-modules',
    isMaster: true
  });

  const moduleName = 'existing-module';
  const inpack = new Inpack();

  await inpack.add(join(sandbox.path), moduleName, {
    main: 'component.js'
  });

  const prefix = `@${sandbox.id}/`;
  const compiled = await compileModuleInfo(sandbox.path, moduleName, 'component.js', prefix);

  t.true(compiled.realDirectoryStat.isDirectory());
  t.true(compiled.mainFileStat.isFile());
  t.true(compiled.nodeModuleDirectoryStat.isDirectory());
  t.is(compiled.symlink, resolve(compiled.modulePath));

  const prefixedModuleName = `${prefix}${moduleName}`;

  t.deepEqual(compiled.pkg, {
    name: prefixedModuleName,
    main: join(moduleSrcDirName, 'component.js'),
    inpack: true
  });

  t.deepEqual(compiled.inpack.modules, {
    [moduleName]: {
      path: moduleName,
      package: {
        name: prefixedModuleName,
        main: join(moduleSrcDirName, 'component.js'),
        inpack: true
      }
    }
  });

  await sandbox.remove();
});
