import * as T from 'io-ts';
import { Option } from 'funfix';

import { Uuid, uuidDef, isoDateDef, optionDef } from './types';

const purgeDef = T.interface({
    purged_at: isoDateDef,
    hostname: T.string,
    username: T.string,
    ip: optionDef(T.string)
});

const contextDef = T.interface({
    subject_id: uuidDef,
    hostname: T.string,
    username: T.string,
    // TODO: Define IP type
    ip: optionDef(T.string),
    purge: optionDef(purgeDef)
});

export const eventDef = <
    NS extends T.LiteralC<any>,
    TY extends T.LiteralC<any>,
    ETY extends T.LiteralC<any>,
    D extends T.Mixed
>(
    event_namespace: NS,
    event_type: TY,
    entity_type: ETY,
    data: D
) =>
    T.interface({
        id: uuidDef,
        sequence_number: T.Integer,
        event_namespace,
        event_type,
        entity_id: uuidDef,
        entity_type,
        created_at: isoDateDef,
        data: optionDef(data),
        context: contextDef
    });

export const oneEventDef = eventDef(
    T.literal('one'),
    T.literal('Event'),
    T.literal('user'),
    T.interface({
        foo: T.string
    })
);

export type OneEvent = T.TypeOf<typeof oneEventDef>;

import { Some, None } from 'funfix';

const thing: OneEvent = {
    id: '',
    sequence_number: 0,
    event_namespace: 'one',
    event_type: 'Event',
    entity_id: '',
    entity_type: 'user',
    created_at: '',
    context: {
        subject_id: '',
        hostname: '',
        username: '',
        ip: None,
        purge: None
    },
    data: Some({
        foo: 'bar',
        blah: true,
    })
};

const blah = T.interface({
    baz: T.string
});

const blahOpt = optionDef(blah);

type BlahOpt = T.TypeOf<typeof blahOpt>;

const bobs: BlahOpt = Some({ baz: 'asdas' });

