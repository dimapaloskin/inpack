import test from 'ava';
import createSandbox from './utils/create-sandbox';
import Inpack from './../lib';

test('should throw exception if incorrect directory passed', async t => {

  const inpack = new Inpack();

  const failedInit = inpack.init();
  const error = await t.throws(failedInit);
  t.is(error.message, 'Incorrect options passed: undefined');
});

test('should initialize new inpack project', async t => {

  const sandbox = await createSandbox({
    withoutInpack: true
  });

  sandbox.remove();
  t.pass();
});
