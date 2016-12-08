const { join } = require('path');
const fsxtra = require('fs-extra');
const Promise = require('bluebird');
const shortid = require('shortid');
const constants = require('./constants');

const fs = Promise.promisifyAll(fsxtra);

const createCleanMethod = path => {
  return async () => {
    await fs.removeAsync(path);
  };
};

const generatePackageJson = async (sandboxPath, sandboxId) => {
  const pkg = {
    name: sandboxId,
    main: 'index.js'
  };

  const path = join(sandboxPath, 'package.json');
  await fs.writeJsonAsync(path, pkg);
};

const generateSymlyJson = async (sandboxPath, sandboxId) => {
  const symly = {
    name: sandboxId,
    prefix: `@${sandboxId}`
  };

  const path = join(sandboxPath, 'symly.json');
  await fs.writeJsonAsync(path, symly);
};

export default async (options = {}) => {

  const defaultOptions = {
    isMaster: true,
    structure: null,
    withoutSymly: false,
    withoutPkg: false
  };

  options = { ...defaultOptions, ...options };

  const sandbox = {};

  try {
    const sandboxId = shortid.generate();
    const sandboxPath = join(__dirname, constants.sandboxCampRelativePath, sandboxId);
    await fs.mkdirsAsync(sandboxPath);
    sandbox.id = sandboxId;
    sandbox.path = sandboxPath;
    sandbox.remove = createCleanMethod(sandboxPath);

    if (options.isMaster) {
      sandbox.isMaster = true;

      if (!options.withoutPkg) {
        await generatePackageJson(sandboxPath, sandboxId);
      }

      if (!options.withoutSymly) {
        await generateSymlyJson(sandboxPath, sandboxId);
        sandbox.isMaster = false;
      }

      const nodeModulesPath = join(sandboxPath, 'node_modules');
      await fs.mkdirsAsync(nodeModulesPath);
    }

    if (options.structure) {
      const structurePath = join(__dirname, constants.fixturesRelativePath, 'structures', options.structure);
      await fs.accessAsync(structurePath, fs.constants.R_OK);
      await fs.copyAsync(structurePath, sandboxPath);
    }

    return sandbox;
  } catch (err) {
    throw new Error(err);
  }

};
