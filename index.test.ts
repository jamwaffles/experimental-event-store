import test from 'ava';

import { Thing } from '.';
import { OneEvent } from './events';

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

test('Save', async (t: any) => {
    const valid = {
        foo: "Strang",
        bar: 1010
    };

    const thing = new Thing(valid as any);

    t.true(thing.is_valid());


    const event: OneEvent = {
        event_namespace: 'one',
        event_type: 'Event',
        foo: 'strang'
    }

    const result = await thing.save(event);
});
