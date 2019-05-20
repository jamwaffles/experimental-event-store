import * as T from 'io-ts';

import { eventDef } from './types';

export const OneEvent = eventDef(
  T.literal('one'),
  T.literal('Event'),
  T.literal('something'),
  T.interface({
    foo: T.string
  })
);

export const SecondThing = eventDef(
  T.literal('second'),
  T.literal('Thing'),
  T.literal('something'),
  T.interface({
    foo: T.string
  })
);

export const ThirdBlah = eventDef(
  T.literal('third'),
  T.literal('Blah'),
  T.literal('something_else'),
  T.interface({
    foo: T.string
  })
);

export type OneEvent = T.TypeOf<typeof OneEvent>;
export type SecondThing = T.TypeOf<typeof SecondThing>;
export type ThirdBlah = T.TypeOf<typeof ThirdBlah>;

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
