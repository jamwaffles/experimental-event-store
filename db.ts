import * as T from 'io-ts';
import { Option } from 'funfix';

import { Uuid, Rfc3339Date, optionDef } from './types';
import { OneEvent } from './events';

const Purge = T.interface({
    purged_at: Rfc3339Date,
    hostname: T.string,
    username: T.string,
    ip: optionDef(T.string)
});

const Context = T.interface({
    subject_id: Uuid,
    hostname: T.string,
    username: T.string,
    // TODO: Define IP type
    ip: optionDef(T.string),
    purge: optionDef(Purge)
});

export type Purge = T.TypeOf<typeof Purge>;
export type Context = T.TypeOf<typeof Context>;

export const eventDef = <
    NS extends T.LiteralC<any>,
    TY extends T.LiteralC<any>,
    ETY extends T.LiteralC<any>,
    D extends T.InterfaceType<any>
>(
    event_namespace: NS,
    event_type: TY,
    entity_type: ETY,
    data: D
) =>
    T.interface({
        id: Uuid,
        sequence_number: T.Integer,
        event_namespace,
        event_type,
        entity_id: Uuid,
        entity_type,
        created_at: Rfc3339Date,
        data: optionDef(T.exact(data)),
        context: Context
    });

// Test:

import { Some, None } from 'funfix';

const thing: OneEvent = {
    id: '',
    sequence_number: 0,
    event_namespace: 'one',
    event_type: 'Event',
    entity_id: '',
    entity_type: 'something',
    created_at: '',
    context: {
        subject_id: '',
        hostname: '',
        username: '',
        ip: None,
        purge: None
    },
    data: Some({
        foo: 'bar'
    })
};
