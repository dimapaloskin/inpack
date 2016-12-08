import test from 'ava';
// import sleep from 'async-sleep';
import createSandbox from './utils/create-sandbox';
import { aggregateContext } from './..';

let sandbox;
test.before(async () => {
  sandbox = await createSandbox();
});

test.after(async () => {
  await sandbox.remove();
});

test('Should throw exception if receive incorrect working directory', async t => {

  const promise = aggregateContext({ directory: {} });
  const error = await t.throws(promise);
  t.is(error.message, 'TypeError: Path must be a string. Received {}', 'unexpected error');
});

test('Should aggregate directory context', async t => {

  const context = await aggregateContext({ directory: sandbox.path });

  t.is(context.isMaster, true);
  t.is(context.directory, sandbox.path);
  t.is(context.masterPath, sandbox.path);

});
