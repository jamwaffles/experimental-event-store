import * as T from 'io-ts';
import * as FP from 'fp-ts/lib/Either';
import { PartialType, InterfaceType } from 'io-ts';
import { Option, None, Some, Either } from 'funfix';
import { v4 } from 'uuid';

interface UuidBrand {
  readonly Uuid: unique symbol;
}

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
export const Uuid = T.refinement(
  T.string,
  (str): str is T.Branded<string, UuidBrand> => uuidRegex.test(str),
  'Uuid'
);
export type Uuid = T.TypeOf<typeof Uuid>;

interface Rfc3339DateBrand {
  readonly Rfc3339Date: unique symbol;
}

const rfc3339DateRegex = /^([0-9]+)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])[Tt]([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.[0-9]+)?(([Zz])|([\+|\-]([01][0-9]|2[0-3]):[0-5][0-9]))$/;
export const Rfc3339Date = T.refinement(
  T.string,
  (str): str is T.Branded<string, Rfc3339DateBrand> => rfc3339DateRegex.test(str),
  'Rfc3339Date'
);
export type Rfc3339Date = T.TypeOf<typeof Rfc3339Date>;

type OptionCodec<C extends T.Mixed> = T.Type<
  Option<T.TypeOf<C>>,
  T.OutputOf<C> | T.OutputOf<T.NullType>,
  unknown
>;

/**
An option that serialises `None` to `null` and deserialises `null` to `None`.

If the input value is falsy but is not null, it will fail to decode. This maintains symmetry between
ser/de. JSON.stringify cannot be used with this type as it breaks symmetry when serializing `Option<>`
*/
export function optionDef<C extends T.Mixed>(codec: C): OptionCodec<C> {
  return new T.Type(
    `Option<${codec.name}>`,
    (u): u is Option<T.TypeOf<C>> => u instanceof Option,
    (u, c): FP.Either<T.Errors, Option<C>> => {
      if (u === null) {
        return T.success(None);
      } else {
        return codec.validate(u, c).chain((value: C) => T.success(Some(value)));
      }
    },
    a => a.getOrElse(null)
  );
}

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

export const Event = T.interface({
  id: Uuid,
  sequence_number: T.Integer,
  event_namespace: T.string,
  event_type: T.string,
  entity_id: Uuid,
  entity_type: T.string,
  created_at: Rfc3339Date,
  data: T.strict({}),
  context: Context
});

export type Event = T.TypeOf<typeof Event>;

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
    ...Event.props,
    event_namespace,
    event_type,
    entity_type,
    data: T.exact(data)
  });

export function createEvent<E extends Event>(
  event_namespace: E['event_namespace'],
  event_type: E['event_type'],
  entity_type: E['entity_type'],
  entity_id: Uuid,
  data: E['data']
): E {
  return ({
    id: v4(),
    sequence_number: null,
    event_namespace,
    event_type,
    entity_id,
    entity_type,
    created_at: new Date().toISOString(),
    data,
    context: {
      subject_id: '',
      hostname: '',
      username: '',
      ip: None,
      purge: None
    }
  } as unknown) as E;
}

import { OneEvent } from './events';
const blah: OneEvent = createEvent<OneEvent>('one', 'Event', 'something', v4(), {
  foo: 'hello'
});
