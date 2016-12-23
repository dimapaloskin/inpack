import test from 'ava';
import Inpack from './../src/lib';

test('Should construct inpack correct', t => {

  t.notThrows(() => {
    const inpack = new Inpack();
    t.true(inpack instanceof Inpack, 'should be an instance of Symple class');
    t.is(inpack.workingDir, process.cwd(), 'workingDir should be equal process.cwd()');

  });

});
