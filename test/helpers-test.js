import test from 'tape';
import Helpers from '../src/helpers.js';

test('test helper functions', (t) => {
	t.equal(Helpers.getUnixSeconds(), Math.round(Date.now() / 1000));
	t.end();
});