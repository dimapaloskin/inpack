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

    debug('check is module already exists', nodeModulePath);
    try {
      await fs.statAsync(nodeModulePath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fs.mkdirp(nodeModulePath);
      } else {
        throw new Error(err);
      }
    }

    debug('generate package.json');
    let pkgBody = options.pkg || {
      name: moduleName,
      main: join(moduleSrcDirName, options.main)
    };

    pkgBody = {...pkgBody, ...{ inpack: true }};

    const sourceDirPath = resolve(join(nodeModulePath, moduleSrcDirName));
    let sourceLink;
    try {
      sourceLink = await fs.readlinkAsync(sourceDirPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        sourceLink = null;
      } else if (err.code === 'EINVAL') {
        sourceLink = '\\';
      } else {
        throw new Error(err);
      }
    }

    if (sourceLink && resolve(sourceLink) !== resolvedModule.absolute) {
      debug('remove previously linked module');
      await fs.removeAsync(resolve(sourceLink));
      sourceLink = null;
    }

    if (!sourceLink) {
      debug('create symlink', resolvedModule.absolute, sourceDirPath);
      await fs.ensureSymlinkAsync(resolvedModule.absolute, sourceDirPath);
    }

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