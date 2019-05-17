import * as T from 'io-ts';
import { Option, None, Some } from 'funfix';

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
export const uuidDef = T.refinement(T.string, str => uuidRegex.test(str), 'UUID');
export type Uuid = T.TypeOf<typeof uuidDef>;

const isoDateRegex = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/;
export const isoDateDef = T.refinement(T.string, str => isoDateRegex.test(str), 'ISO-8601');
export type IsoDate = T.TypeOf<typeof isoDateDef>;

export const optionDef = <A extends T.Mixed>(data: A): T.Type<Option<A>> =>
    new T.Type<Option<A>, A | null>(
        `Option<${data.name}>`,
        (u): u is Option<A> => u instanceof Option,
        (u, c) => {
            const ret = Option.of(u);

            return ret
                .map(s => data.validate(s, c).chain(s => T.success(Option.of(s))))
                .getOrElse(T.success(None));
        },
        (a: Option<A>): A | null => a.getOrElse(null)
    );
