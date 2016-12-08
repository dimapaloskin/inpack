import test from 'ava';
import createSandbox from './utils/create-sandbox';
import Symly from './../lib';

test('should throw exception if incorrect directory passed', async t => {

  const symly = new Symly();

  const failedInit = symly.init();
  const error = await t.throws(failedInit);
  t.is(error.message, 'Incorrect options passed: undefined');
});

test('should initialize new symply project', async t => {

  const sandbox = await createSandbox({
    withoutSymly: true
  });

  sandbox.remove();
  t.pass();
});
