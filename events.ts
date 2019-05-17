import * as T from 'io-ts';

export const oneEventDef = T.interface({
    event_namespace: T.literal('one'),
    event_type: T.literal('Event'),
    foo: T.string,
});

export const secondThingDef = T.interface({
    event_namespace: T.literal('second'),
    event_type: T.literal('Thing'),
    bar: T.number,
});

export const thirdBlahDef = T.interface({
    event_namespace: T.literal('third'),
    event_type: T.literal('Blah'),
    unrelated_crap: T.string
});

export type OneEvent = T.TypeOf<typeof oneEventDef>;
export type SecondThing = T.TypeOf<typeof secondThingDef>;
export type ThirdBlah = T.TypeOf<typeof thirdBlahDef>;
