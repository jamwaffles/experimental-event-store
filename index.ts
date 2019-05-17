import * as T from 'io-ts';
import { Either, Left, Right } from 'funfix';

import { oneEventDef, secondThingDef, thirdBlahDef } from './events';

interface Aggregator<E> {
    save(event: E): Promise<Either<string, E>>;
}

const thingPropsDef = T.interface({
    foo: T.string,
    bar: T.Integer,
});

type ThingProps = T.TypeOf<typeof thingPropsDef>;

const thingEventsDef = T.union([oneEventDef, secondThingDef]);

type ThingEvents = T.TypeOf<typeof thingEventsDef>;

export class Thing implements ThingProps, Aggregator<ThingEvents> {
    public foo: string;
    public bar: number;

    public constructor(entity: ThingProps) {
        const { foo, bar } = entity;

        this.foo = foo;
        this.bar = bar;
    }

    public is_valid(): boolean {
        return thingPropsDef
            .decode(this)
            .map((r) => true)
            .getOrElse(false);
    }

    public async save(
        event: ThingEvents,
    ): Promise<any> {
        return thingEventsDef
            .decode(event)
            .map(async (event) => {
                // Artificial delay
                await new Promise((resolve) => setTimeout(resolve, 100));

                return Promise.resolve(event);
            })
            .mapLeft(() => 'Bad');
    }
}
