const { join, basename, resolve } = require('path');
const debug = require('debug')('inpack:add');
const InpackError = require('./utils/error');
const fs = require('./utils/fs');
const aggregateContext = require('./aggregate-context');
const modulePathResolver = require('./module-path-resolver');
const { defaultModuleOptions, moduleSrcDirName } = require('./constants');

const add = async (directory, path, options) => {

  debug('add module: ', directory, path, options);
  try {
    if (!options && typeof path === 'object') {
      options = path;
      path = undefined;
    }

    if (!options) {
      options = {};
    }

    options = { ...defaultModuleOptions, ...options };

    const context = await aggregateContext(directory);

    if (!context.masterConfigPath) {
      throw new InpackError('Master project is not found');
    }

    const resolvedModule = await modulePathResolver(directory, path, context.masterPath);

    const inpackJson = await fs.readJsonAsync(context.masterConfigPath);
    const prefix = inpackJson.prefix || '';
    const moduleName = `${prefix}${options.name || basename(resolvedModule.absolute)}`;
    const nodeModulePath = join(resolvedModule.masterAbsolutePath, 'node_modules', moduleName);

    if (!resolvedModule.exists && !options.create) {
      throw new InpackError('Target module path does not exist. Create directory manually or use --create option');
    }

    if (!resolvedModule.exists && options.create) {
      debug('create module directory', resolvedModule.absolute);
      await fs.mkdirpAsync(resolvedModule.absolute);
      const mainFilePath = join(resolvedModule.absolute, options.main);
      debug('create module main file', mainFilePath);
      await fs.writeFileAsync(mainFilePath, '');
    }

    await fs.mkdirp(nodeModulePath);

    let pkgBody = options.pkg || {
      name: moduleName,
      main: join(moduleSrcDirName, options.main)
    };

    pkgBody = {...pkgBody, ...{ inpack: true }};

    const sourceDirPath = resolve(join(nodeModulePath, moduleSrcDirName));

    await fs.removeAsync(sourceDirPath);
    await fs.ensureSymlinkAsync(resolvedModule.absolute, sourceDirPath);
    await fs.writeJsonAsync(join(nodeModulePath, 'package.json'), pkgBody);

    if (!inpackJson.modules) {
      inpackJson.modules = {};
    }

    inpackJson.modules[moduleName] = {
      path: resolvedModule.relative,
      package: pkgBody
    };

    debug('writing inpack.json');
    await fs.writeJsonAsync(context.masterConfigPath, inpackJson);

    return context;
  } catch (err) {
    throw (err instanceof Error) ? err : new Error(err);
  }
};

module.exports = add;
