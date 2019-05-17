import * as T from "io-ts";
import { Option, None, Some } from "funfix";

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
export const uuidDef = T.refinement(
  T.string,
  str => uuidRegex.test(str),
  "UUID"
);
export type Uuid = T.TypeOf<typeof uuidDef>;

const isoDateRegex = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/;
export const isoDateDef = T.refinement(
  T.string,
  str => isoDateRegex.test(str),
  "ISO-8601"
);
export type IsoDate = T.TypeOf<typeof isoDateDef>;

export type OptionCodec<C extends T.Mixed> = T.Type<
  Option<T.TypeOf<C>>,
  T.OutputOf<C> | T.OutputOf<T.NullType>,
  unknown
>;

export function optionDef<C extends T.Mixed>(
  codec: C,
  name: string = `Option<${codec.name}>`
): OptionCodec<C> {
  return new T.Type(
    name,
    (u): u is Option<T.TypeOf<C>> => u instanceof Option,
    (u, c) =>
      Option.of(u)
        .map(value => {
          return codec
            .validate(value, c)
            .chain(value => T.success(Option.of(value)));
        })
        .getOrElse(T.success(None)),
    a => a.getOrElse(null)
  );
}
