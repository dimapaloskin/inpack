const { posix: { join, basename, resolve } } = require('path');
const debug = require('debug')('inpack:add');
const InpackError = require('./../utils/error');
const fs = require('./../utils/fs');
const aggregateContext = require('./../aggregate-context');
const modulePathResolver = require('./../module-path-resolver');
const { defaultModuleOptions, moduleSrcDirName } = require('./../constants');

const add = async (directory, path, options) => {
  debug('with arguments ', directory, path, options);

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

    if (!context.masterConfigPath || !context.masterPath) {
      throw new InpackError('Master project is not found');
    }

    const resolvedModule = await modulePathResolver(directory, path, context);

    const inpackJson = await fs.readJsonAsync(context.masterConfigPath);
    const prefix = inpackJson.prefix || '';
    const moduleName = options.name || basename(resolvedModule.absolute);
    const prefixedModuleName = `${prefix}${moduleName}`;
    const nodeModulePath = join(resolvedModule.masterAbsolutePath, 'node_modules', prefixedModuleName);

    if (inpackJson.modules && inpackJson.modules[moduleName] && inpackJson.modules[moduleName].path !== resolvedModule.relative) {
      throw new InpackError(`${moduleName} is already linked with another module. Remove previous module at first`);
    }

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
      name: prefixedModuleName,
      main: join(moduleSrcDirName, options.main)
    };

    pkgBody = {...pkgBody, ...{ inpack: true }};

    const sourceDirPath = resolve(join(nodeModulePath, moduleSrcDirName));

    debug('remove src directory if exist', sourceDirPath);
    await fs.removeAsync(sourceDirPath);
    debug('create symlink', resolvedModule.absolute, sourceDirPath);
    await fs.ensureSymlinkAsync(resolvedModule.absolute, sourceDirPath);
    debug('writing package.json', nodeModulePath);
    await fs.writeJsonAsync(join(nodeModulePath, 'package.json'), pkgBody);

    if (!inpackJson.modules) {
      inpackJson.modules = {};
    }

    const inpackModule = {
      path: resolvedModule.relative,
      name: moduleName,
      package: pkgBody
    };

    inpackJson.modules[moduleName] = inpackModule;

    debug('writing inpack.json');
    await fs.writeJsonAsync(context.masterConfigPath, inpackJson);

    return inpackModule;
  } catch (err) {
    throw (err instanceof Error) ? err : new Error(err);
  }
};

module.exports = add;
