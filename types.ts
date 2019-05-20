import * as T from 'io-ts';
import * as FP from 'fp-ts/lib/Either';
import { PartialType, InterfaceType } from 'io-ts';
import { Option, None, Some, Either } from 'funfix';

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
