import { tmpdir } from 'os';
import { join } from 'path';
import test from 'ava';
import createSandbox from './utils/create-sandbox';
import aggregateContext from './../lib/aggregate-context';

test('Should throw exception if receive incorrect working directory', async t => {

  const promise = aggregateContext({});
  const error = await t.throws(promise);
  t.is(error.message, 'Incorrect directory passed', 'unexpected error');
});

test('Should throw exception if received path is not directory', async t => {

  const sandbox = await createSandbox({
    structure: 'deep'
  });

  const promise = aggregateContext(join(sandbox.path, 'index.js'));
  const error = await t.throws(promise);
  t.is(error.message, 'Passed path is not directory', 'unexpected error');

  sandbox.remove();
});

test('Should aggregate directory context', async t => {

  const sandbox = await createSandbox();
  const context = await aggregateContext(sandbox.path);

  t.is(context.isMaster, true);
  t.is(context.isChild, false);
  t.is(context.directory, sandbox.path);
  t.is(context.masterPath, sandbox.path);
  t.deepEqual(context.pkg, {
    name: sandbox.id,
    main: 'index.js'
  });
  t.deepEqual(context.inpack, {
    name: sandbox.id,
    prefix: `@${sandbox.id}`
  });

  await sandbox.remove();
});

test('Should detect master project if passed directory is not master', async t => {

  const sandbox = await createSandbox({
    structure: 'deep'
  });

  const deepPath = join(sandbox.path, 'level1/level2/level3');
  const context = await aggregateContext(deepPath);

  t.is(context.isMaster, false);
  t.is(context.isChild, true);
  t.is(context.directory, deepPath);
  t.is(context.masterPath, sandbox.path);
  t.is(context.inpack, null);
  t.is(context.pkg, null);

  await sandbox.remove();
});

test('Should aggregate correct context if master is not found', async t => {

  const tmp = tmpdir();
  const context = await aggregateContext(tmp);

  t.is(context.isMaster, false);
  t.is(context.isChild, false);
  t.is(context.directory, tmp);
  t.is(context.masterPath, null);
  t.is(context.pkg, null);
  t.is(context.inpack, null);

  t.pass();

});
