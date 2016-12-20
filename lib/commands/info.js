const { join, relative } = require('path');
const slash = require('slash');
const aggregateContext = require('./../aggregate-context');
const modulePathResolver = require('./../module-path-resolver');
const { moduleSrcDirName } = require('./../constants');
const InpackError = require('./../utils/error');
const fs = require('./../utils/fs');

const info = async function (directory, moduleName) {

  try {
    const context = await aggregateContext(directory);

    if (!context.masterPath) {
      throw new InpackError('Master project is not found');
    }

    const modules = context.inpack.modules;
    if (!moduleName) {
      const relativePath = slash(relative(context.masterPath, directory));
      moduleName = Object.keys(modules).find(name => modules[name].path === relativePath);
    }

    const result = {};
    const module = modules[moduleName];

    if (typeof module !== 'object') {
      throw new InpackError(`Inpack configuration does not contain information about ${moduleName} module`);
    }

    const resolvedModule = await modulePathResolver(directory, module.path, context);

    result.masterAbsolutePath = resolvedModule.masterAbsolutePath;
    result.relative = resolvedModule.relative;
    result.absolute = resolvedModule.absolute;
    result.name = module.name;
    result.prefixedName = module.package.name;
    result.mainFile = (module.package.main.startsWith(moduleSrcDirName)) ? module.package.main.substr(moduleSrcDirName.length + 1) : module.package.main;

    const nodeModuleSrcPath = join(result.masterAbsolutePath, 'node_modules', result.prefixedName, moduleSrcDirName);

    let isLinked = true;
    try {
      const link = await fs.readlinkAsync(nodeModuleSrcPath);
      if (link !== result.absolute) {
        isLinked = false;
      }
    } catch (err) {
      isLinked = false;
    }

    result.isLinked = isLinked;

    return result;
  } catch (err) {
    throw (err instanceof Error || err instanceof InpackError) ? err : new Error(err);
  }
};

module.exports = info;
