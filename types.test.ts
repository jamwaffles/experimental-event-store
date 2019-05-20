import * as T from 'io-ts';
import test from 'ava';
import { Option, Some, None } from 'funfix';

import { optionDef } from './types';
import { OneEvent } from './events';

const optionType = optionDef(T.string);

test('Option some', (t: any) => {
    t.deepEqual(optionType.decode('banana').value, Some('banana'));
});

test('Option none', (t: any) => {
    t.deepEqual(optionType.decode(null).value, None);
});

test('Option bad', (t: any) => {
    t.deepEqual(optionType.decode(100).isLeft(), true);
});
