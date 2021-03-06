const { join, basename, resolve, normalize } = require('path');
const slash = require('slash');
const InpackError = require('./../utils/error');
const fs = require('./../utils/fs');
const aggregateContext = require('./../aggregate-context');
const modulePathResolver = require('./../module-path-resolver');
const { defaultModuleOptions, moduleSrcDirName } = require('./../constants');
const createEmit = require('./../utils/create-emit');

const add = async function (directory, path, options) {

  try {
    const emit = createEmit(this);

    if (!options && typeof path === 'object') {
      options = path;
      path = undefined;
    }

    if (!isNaN(parseFloat(path)) && isFinite(path)) {
      path = path.toString();
    }

    if (!options) {
      options = {};
    }

    options = { ...defaultModuleOptions, ...options };

    const context = await aggregateContext(directory);

    if (!context.masterConfigPath || !context.masterPath) {
      throw new InpackError('Master project has not been found');
    }

    if (resolve(context.masterPath) === resolve(directory) && !path && !options.name) {
      throw new InpackError('You cannot add master project to master project. If you want, you can use --name');
    }

    emit('add:context', context);

    const resolvedModule = await modulePathResolver(directory, path, context);

    const inpackJson = await fs.readJsonAsync(context.masterConfigPath);
    const prefix = inpackJson.prefix || '';
    const moduleName = options.name || basename(resolvedModule.absolute);
    const prefixedModuleName = `${prefix}${moduleName}`;
    const nodeModulePath = join(resolvedModule.masterAbsolutePath, 'node_modules', prefixedModuleName);
    emit('add:module-names', { name: moduleName, prefixed: prefixedModuleName });

    if (inpackJson.modules && inpackJson.modules[moduleName] && normalize(inpackJson.modules[moduleName].path) !== resolvedModule.relative) {
      throw new InpackError(`${moduleName} is already linked with another module. Remove previous module at first`);
    }

    if (!resolvedModule.exists && !options.create) {
      throw new InpackError(`Target path ${resolvedModule.absolute} for module "${resolvedModule.relative}" does not exist. Create directory manually or use --create option`);
    }

    if (!resolvedModule.exists && options.create) {
      await fs.mkdirpAsync(resolvedModule.absolute);
      const mainFilePath = join(resolvedModule.absolute, options.main);
      await fs.writeFileAsync(mainFilePath, '');
    }

    await fs.mkdirp(nodeModulePath);

    //  generate module package.json
    //  merge options, previously generated package.json and
    //  module's package.json (if exists)
    options.pkg = options.pkg || {
      name: prefixedModuleName,
      main: slash(join(moduleSrcDirName, options.main))
    };

    if (resolvedModule.packageJson && typeof resolvedModule.packageJson.main === 'string') {
      resolvedModule.packageJson.main = slash(join(moduleSrcDirName, resolvedModule.packageJson.main));
    }

    let pkgBody = { ...options.pkg, ...resolvedModule.packageJson };
    pkgBody = {...pkgBody, ...{ inpack: true }};

    const destination = resolve(join(nodeModulePath, moduleSrcDirName));

    await fs.removeAsync(destination);

    emit('add:link', {
      relative: resolvedModule.relative,
      absolute: resolvedModule.absolute,
      destination
    });

    await fs.ensureSymlinkAsync(resolvedModule.absolute, destination);

    await fs.writeJsonAsync(join(nodeModulePath, 'package.json'), pkgBody);

    if (!inpackJson.modules) {
      inpackJson.modules = {};
    }

    const inpackModule = {
      path: slash(resolvedModule.relative),
      name: moduleName,
      package: pkgBody
    };

    inpackJson.modules[moduleName] = inpackModule;

    if (!options.silent) {
      await fs.writeJsonAsync(context.masterConfigPath, inpackJson);
    }

    return inpackModule;
  } catch (err) {
    throw (err instanceof Error || err instanceof InpackError) ? err : new Error(err);
  }
};

module.exports = add;
