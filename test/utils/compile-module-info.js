import { join } from 'path';
import fs from './../../src/lib/utils/fs';
import { moduleSrcDirName, inpackConfigName } from './../../src/lib/constants';

const compileModuleInfo = async (sandboxPath, moduleName, path, opts = { mainFile: 'index.js', prefix: '' }) => {

  // absolute module path (technically it is should support symlinks too)
  const modulePath = join(sandboxPath, path);
  // absolute path to module that will created in the node_modules directory
  const nodeModulePath = join(sandboxPath, 'node_modules', `${opts.prefix}${moduleName}`);
  const realDirectoryStat = await fs.statAsync(modulePath);
  const mainFileStat = await fs.statAsync(join(modulePath, opts.mainFile));
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

export default compileModuleInfo;
