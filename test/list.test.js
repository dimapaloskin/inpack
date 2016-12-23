import { join } from 'path';
import test from 'ava';
import createSandbox from './utils/create-sandbox';
import link from './../lib/commands/link';
import list from './../lib/commands/list';

test('should provide information about all modules', async t => {

  const sandbox = await createSandbox({
    isMaster: false,
    structure: 'preinstalled'
  });

  const corePath = join(sandbox.path, 'core');

  await link(corePath);

  const result = await list(corePath);
  t.is(result.successed.length, 3);

  const names = result.successed.map(module => {
    return module.name;
  });

  t.deepEqual(names, ['main', 'helpers', 'super-module']);

  sandbox.remove();
});
