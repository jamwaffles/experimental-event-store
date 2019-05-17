import * as T from 'io-ts';
import { Either, Left, Right, Future } from 'funfix';

import { OneEvent, oneEventDef, secondThingDef, thirdBlahDef } from './events';

interface Aggregator<EV, ENT> {
    // constructor(create: CEV): ENT;

    apply(event: EV): ENT;
}

const thingEventsDef = T.union([oneEventDef, secondThingDef]);

type ThingEvents = T.TypeOf<typeof thingEventsDef>;

export class Thing implements Aggregator<ThingEvents, Thing> {
    public readonly foo: string;
    public readonly bar: number;

    // Accepts ThingCreated event - pattern
    // Force constructor to take *Created "gensisis" event
    // Event must be create externally
    public constructor(create: OneEvent) {
        const { foo } = create;

        this.foo = foo;
        this.bar = 100;

        return this;
    }

    // Does not save events, returns SAME entitiy with event applied to it
    public apply(
        // TODO: Omit `OneEvent` creation event
        event: ThingEvents,
    ): Thing {
        // TODO: Apply `event` using aggregate event handler thingies
        // TODO: Validate event

        // TODO: Keep changelog of applied events since read

        return this
    }

    // Save self to DB (TypeOrm probably does this for us)
    // Return NEW entity
    public async save(store: any): Promise<Thing> {
        // Go through "changelog" and save all events

        // TODO: Emit events

        return this;
    }
}
