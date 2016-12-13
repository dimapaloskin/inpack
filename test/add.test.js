import { tmpdir } from 'os';
import { posix } from 'path';
import test from 'ava';
import createSandbox from './utils/create-sandbox';
import Inpack from './../lib';
import compileModuleInfo from './utils/compile-module-info';
import { moduleSrcDirName } from './../lib/constants';

const { join, resolve } = posix;

test('Should throw error if master project does not found', async t => {

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

  const result = await inpack.add(sandbox.path, moduleName, {
    create: true
  });

  const compiled = await compileModuleInfo(sandbox.path, moduleName, moduleName);

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
      name: moduleName,
      package: {
        name: moduleName,
        main: join(moduleSrcDirName, 'index.js'),
        inpack: true
      }
    }
  });

  t.is(result.path, moduleName);

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

  const compiled = await compileModuleInfo(sandbox.path, moduleName, moduleName);

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
      name: moduleName,
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

  await inpack.add(sandbox.path, moduleName, {
    main: 'component.js'
  });

  const compiled = await compileModuleInfo(sandbox.path, moduleName, moduleName, { mainFile: 'component.js', prefix: '' });

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
      name: moduleName,
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

  await inpack.add(sandbox.path, moduleName, {
    main: 'component.js'
  });

  const prefix = `@${sandbox.id}/`;
  const compiled = await compileModuleInfo(sandbox.path, moduleName, moduleName, { mainFile: 'component.js', prefix });

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
      name: moduleName,
      package: {
        name: prefixedModuleName,
        main: join(moduleSrcDirName, 'component.js'),
        inpack: true
      }
    }
  });

  await sandbox.remove();
});

test('Should add deep module', async t => {
  const sandbox = await createSandbox({
    structure: 'deep',
    isMaster: true
  });

  const moduleName = 'level2';
  const modulePath = 'level1/level2';
  const inpack = new Inpack();

  await inpack.add(join(sandbox.path, modulePath));

  const prefix = `@${sandbox.id}/`;
  const compiled = await compileModuleInfo(sandbox.path, moduleName, modulePath, { mainFile: 'index.js', prefix });

  t.true(compiled.realDirectoryStat.isDirectory());
  t.true(compiled.mainFileStat.isFile());
  t.true(compiled.nodeModuleDirectoryStat.isDirectory());
  t.is(compiled.symlink, resolve(compiled.modulePath));

  t.deepEqual(compiled.pkg, {
    name: `${prefix}${moduleName}`,
    main: join(moduleSrcDirName, 'index.js'),
    inpack: true
  });

  t.deepEqual(compiled.inpack.modules, {
    [moduleName]: {
      path: modulePath,
      name: moduleName,
      package: {
        name: `${prefix}${moduleName}`,
        main: join(moduleSrcDirName, 'index.js'),
        inpack: true
      }
    }
  });

  await sandbox.remove();
});

test('Should support back notation', async t => {
  const sandbox = await createSandbox({
    structure: 'deep',
    isMaster: true,
    noPrefix: true
  });

  const backSandbox = await createSandbox({
    structure: 'deep',
    isMaster: false
  });

  const inpack = new Inpack();

  const moduleName = 'level1';
  const modulePath = join('../', backSandbox.id, moduleName);
  const result = await inpack.add(sandbox.path, modulePath);
  t.is(result.path, modulePath);

  const compiled = await compileModuleInfo(sandbox.path, moduleName, modulePath);

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
      path: modulePath,
      name: moduleName,
      package: {
        name: moduleName,
        main: join(moduleSrcDirName, 'index.js'),
        inpack: true
      }
    }
  });

  await sandbox.remove();
  await backSandbox.remove();
});
