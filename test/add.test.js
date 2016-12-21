import { tmpdir } from 'os';
import { join, resolve } from 'path';
import test from 'ava';
import slash from 'slash';
import createSandbox from './utils/create-sandbox';
import compileModuleInfo from './utils/compile-module-info';
import { moduleSrcDirName } from './../lib/constants';
import add from './../lib/commands/add';

test('Should throw error if master project does not found', async t => {

  const tmp = tmpdir();
  const error = await t.throws(add(tmp));
  t.is(error.message, 'Master project is not found');

});

test('Should throw error if module directory does not exist and create options is not passed', async t => {

  const sandbox = await createSandbox({
    structure: 'deep',
    isMaster: true
  });

  const moduleName = 'module-does-not-exist';
  const absolutePath = resolve(join(sandbox.path, 'module-does-not-exist'));
  const error = await t.throws(add(sandbox.path, moduleName));
  t.is(error.message, `Target path ${absolutePath} for module "${moduleName}" does not exist. Create directory manually or use --create option`);

  await sandbox.remove();

});

test('Should create and add new inpack module in the master project when "create" option passed', async t => {

  const sandbox = await createSandbox({
    structure: 'deep',
    isMaster: true,
    noPrefix: true
  });

  const moduleName = 'module-does-not-exist';

  const result = await add(sandbox.path, moduleName, {
    create: true
  });

  const compiled = await compileModuleInfo(sandbox.path, moduleName, moduleName);

  t.true(compiled.realDirectoryStat.isDirectory());
  t.true(compiled.mainFileStat.isFile());
  t.true(compiled.nodeModuleDirectoryStat.isDirectory());
  t.is(compiled.symlink, resolve(compiled.modulePath));

  t.deepEqual(compiled.pkg, {
    name: moduleName,
    main: slash(join(moduleSrcDirName, 'index.js')),
    inpack: true
  });

  t.deepEqual(compiled.inpack.modules, {
    [moduleName]: {
      path: slash(moduleName),
      name: moduleName,
      package: {
        name: moduleName,
        main: slash(join(moduleSrcDirName, 'index.js')),
        inpack: true
      }
    }
  });

  t.is(result.path, moduleName);

  await sandbox.remove();
});

test('Should create and add new inpack module outside master project. should add the same module twice without errors', async t => {

  const sandbox = await createSandbox({
    structure: 'deep',
    isMaster: true,
    noPrefix: true
  });

  const moduleName = 'level1';

  await add(join(sandbox.path, moduleName));
  // tests adding the same module several times
  await add(join(sandbox.path, moduleName));

  const compiled = await compileModuleInfo(sandbox.path, moduleName, moduleName);

  t.true(compiled.realDirectoryStat.isDirectory());
  t.true(compiled.mainFileStat.isFile());
  t.true(compiled.nodeModuleDirectoryStat.isDirectory());
  t.is(compiled.symlink, resolve(compiled.modulePath));

  t.deepEqual(compiled.pkg, {
    name: moduleName,
    main: slash(join(moduleSrcDirName, 'index.js')),
    inpack: true
  });

  t.deepEqual(compiled.inpack.modules, {
    [moduleName]: {
      path: slash(moduleName),
      name: moduleName,
      package: {
        name: moduleName,
        main: slash(join(moduleSrcDirName, 'index.js')),
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

  await add(sandbox.path, moduleName, {
    main: 'component.js'
  });

  const compiled = await compileModuleInfo(sandbox.path, moduleName, moduleName, { mainFile: 'component.js', prefix: '' });

  t.true(compiled.realDirectoryStat.isDirectory());
  t.true(compiled.mainFileStat.isFile());
  t.true(compiled.nodeModuleDirectoryStat.isDirectory());
  t.is(compiled.symlink, resolve(compiled.modulePath));

  t.deepEqual(compiled.pkg, {
    name: moduleName,
    main: slash(join(moduleSrcDirName, 'component.js')),
    inpack: true
  });

  t.deepEqual(compiled.inpack.modules, {
    [moduleName]: {
      path: slash(moduleName),
      name: moduleName,
      package: {
        name: moduleName,
        main: slash(join(moduleSrcDirName, 'component.js')),
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

  await add(sandbox.path, moduleName, {
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
    main: slash(join(moduleSrcDirName, 'component.js')),
    inpack: true
  });

  t.deepEqual(compiled.inpack.modules, {
    [moduleName]: {
      path: slash(moduleName),
      name: moduleName,
      package: {
        name: prefixedModuleName,
        main: slash(join(moduleSrcDirName, 'component.js')),
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

  await add(join(sandbox.path, modulePath));

  const prefix = `@${sandbox.id}/`;
  const compiled = await compileModuleInfo(sandbox.path, moduleName, modulePath, { mainFile: 'index.js', prefix });

  t.true(compiled.realDirectoryStat.isDirectory());
  t.true(compiled.mainFileStat.isFile());
  t.true(compiled.nodeModuleDirectoryStat.isDirectory());
  t.is(compiled.symlink, resolve(compiled.modulePath));

  t.deepEqual(compiled.pkg, {
    name: `${prefix}${moduleName}`,
    main: slash(join(moduleSrcDirName, 'index.js')),
    inpack: true
  });

  t.deepEqual(compiled.inpack.modules, {
    [moduleName]: {
      path: slash(modulePath),
      name: moduleName,
      package: {
        name: `${prefix}${moduleName}`,
        main: slash(join(moduleSrcDirName, 'index.js')),
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

  const moduleName = 'level1';
  const modulePath = join('../', backSandbox.id, moduleName);
  const result = await add(sandbox.path, modulePath);
  t.is(result.path, slash(modulePath));

  const compiled = await compileModuleInfo(sandbox.path, moduleName, modulePath);

  t.true(compiled.realDirectoryStat.isDirectory());
  t.true(compiled.mainFileStat.isFile());
  t.true(compiled.nodeModuleDirectoryStat.isDirectory());
  t.is(compiled.symlink, resolve(compiled.modulePath));

  t.deepEqual(compiled.pkg, {
    name: moduleName,
    main: slash(join(moduleSrcDirName, 'index.js')),
    inpack: true
  });

  t.deepEqual(compiled.inpack.modules, {
    [moduleName]: {
      path: slash(modulePath),
      name: moduleName,
      package: {
        name: moduleName,
        main: slash(join(moduleSrcDirName, 'index.js')),
        inpack: true
      }
    }
  });

  await sandbox.remove();
  await backSandbox.remove();
});

test('Should use existing package.json', async t => {

  const sandbox = await createSandbox({
    structure: 'deep',
    isMaster: true,
    noPrefix: true
  });

  const moduleName = 'pack';

  await add(join(sandbox.path, moduleName));

  const compiled = await compileModuleInfo(sandbox.path, moduleName, moduleName, {
    mainFile: 'pack.js',
    prefix: ''
  });

  t.true(compiled.realDirectoryStat.isDirectory());
  t.true(compiled.mainFileStat.isFile());
  t.true(compiled.nodeModuleDirectoryStat.isDirectory());
  t.is(compiled.symlink, resolve(compiled.modulePath));

  t.deepEqual(compiled.pkg, {
    name: moduleName,
    main: slash(join(moduleSrcDirName, 'pack.js')),
    inpack: true,
    customField: true
  });

  t.deepEqual(compiled.inpack.modules, {
    [moduleName]: {
      path: slash(moduleName),
      name: moduleName,
      package: {
        name: moduleName,
        main: slash(join(moduleSrcDirName, 'pack.js')),
        inpack: true,
        customField: true
      }
    }
  });

  await sandbox.remove();
});
