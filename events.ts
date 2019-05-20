import * as T from 'io-ts';

import { eventDef } from './types';

export const oneEventDef = eventDef(
  T.literal('one'),
  T.literal('Event'),
  T.literal('something'),
  T.interface({
    foo: T.string
  })
);

export const secondThingDef = eventDef(
  T.literal('second'),
  T.literal('Thing'),
  T.literal('something'),
  T.interface({
    foo: T.string
  })
);

export const thirdBlahDef = eventDef(
  T.literal('third'),
  T.literal('Blah'),
  T.literal('something_else'),
  T.interface({
    foo: T.string
  })
);

export type OneEvent = T.TypeOf<typeof oneEventDef>;
export type SecondThing = T.TypeOf<typeof secondThingDef>;
export type ThirdBlah = T.TypeOf<typeof thirdBlahDef>;

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
  data: {
    foo: 'bar'
  }
};
