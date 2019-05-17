import * as T from 'io-ts';
import test from 'ava';
import { Option, Some, None } from 'funfix';

import { optionDef } from './types';

const optionType = optionDef(T.string);

test('Option some', (t: any) => {
    t.deepEqual(optionType.decode('banana').getOrElse(None), Some('banana'));
});

test('Option none', (t: any) => {
    t.deepEqual(
        optionType.decode(null).getOrElse(Option.of('bad')),
        None
    );
});

test('Option bad', (t: any) => {
    t.deepEqual(
        optionType.decode(100).getOrElse(Option.of('bad')),
        Some('bad')
    );
});
