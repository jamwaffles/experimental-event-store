import test from 'ava';

import { Thing } from '.';

test('Validation', (t: any) => {
    const valid = {
        foo: "Strang",
        bar: 1010
    };

    const invalid = {
        foo: 1001,
        bar: "Number"
    };

    const thing_valid = new Thing(valid as any);
    const thing_invalid = new Thing(invalid as any);

    t.true(thing_valid.is_valid());
    t.false(thing_invalid.is_valid());
});
