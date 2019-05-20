import * as T from 'io-ts';
import * as FP from 'fp-ts/lib/Either';
import { PartialType, InterfaceType } from 'io-ts';
import { Option, None, Some, Either } from 'funfix';

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
export const uuidDef = T.refinement(T.string, str => uuidRegex.test(str), 'UUID');
export type Uuid = T.TypeOf<typeof uuidDef>;

const rfc3339DateRegex = /^([0-9]+)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])[Tt]([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.[0-9]+)?(([Zz])|([\+|\-]([01][0-9]|2[0-3]):[0-5][0-9]))$/;
export const rfc3339DateDef = T.refinement(T.string, str => rfc3339DateRegex.test(str), 'RFC-3339');
export type Rfc3339Date = T.TypeOf<typeof rfc3339DateDef>;

export type OptionCodec<C extends T.Mixed> = T.Type<
  Option<T.TypeOf<C>>,
  T.OutputOf<C> | T.OutputOf<T.NullType>,
  unknown
>;

/**
An option that serialises `None` to `null` and deserialises `null` to `None`.

If the input value is falsy but is not null, it will fail to decode. This maintains symmetry between
ser/de. JSON.stringify cannot be used with this type as it breaks symmetry when serializing `Option<>`
*/
export function optionDef<C extends T.Mixed>(
  codec: C,
  name: string = `Option<${codec.name}>`
): OptionCodec<C> {
  return new T.Type(
    name,
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
