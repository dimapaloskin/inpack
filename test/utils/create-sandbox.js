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

export default async (options = {}) => {

  const defaultOptions = {
    isMaster: true, // will create package.json and node_modules
    structure: null // will copy files from fixtures/structures/[structure_name]
  };

  options = { ...defaultOptions, ...options };

  const sandbox = {};

  try {
    const sandboxId = shortid.generate();
    const sandboxPath = join(__dirname, constants.sandboxCampRelativePath, sandboxId);
    await fs.mkdirAsync(sandboxPath);
    sandbox.path = sandboxPath;
    sandbox.remove = createCleanMethod(sandboxPath);

    if (options.isMaster) {
      sandbox.isMaster = true;
      await generatePackageJson(sandboxPath, sandboxId);
      const nodeModulesPath = join(sandboxPath, 'node_modules');
      await fs.mkdirAsync(nodeModulesPath);
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
