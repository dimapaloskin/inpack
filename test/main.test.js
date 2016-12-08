import test from 'ava';
import Symly from './../';

test('Should initialize symly correct', t => {

  t.notThrows(() => {
    const symly = new Symly();
    t.true(symly instanceof Symly, 'should be an instance of Symple class');
    t.is(symly.workingDir, process.cwd(), 'workingDir should be equal process.cwd()');

  });

});
