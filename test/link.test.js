import { join } from 'path';
import test from 'ava';
import createSandbox from './utils/create-sandbox';
import link from './../lib/commands/link';

test('Should link existing modules correct', async t => {

  const sandbox = await createSandbox({
    isMaster: false,
    structure: 'preinstalled'
  });

  const corePath = join(sandbox.path, 'core');

  await link(corePath);
  const core = require(corePath); // eslint-disable-line import/no-dynamic-require

  t.deepEqual(core, {
    main: 'components/main',
    helpers: 'helpers',
    superModule: '../super-module'
  });

  sandbox.remove();
});
