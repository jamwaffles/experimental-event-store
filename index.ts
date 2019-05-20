import * as T from 'io-ts';
import { Either, Left, Right, Future } from 'funfix';

import { OneEvent, oneEventDef, secondThingDef, thirdBlahDef } from './events';

// NOTE: `ENT` must be the class that implements `Aggregator`. See [here](https://stackoverflow.com/questions/36744033/how-to-reference-type-of-self-in-typescript-interface-for-a-iclonable-interface) for explanation
interface Aggregator<EV, ENT> {
    apply(event: EV): ENT;
}

const thingEventsDef = T.union([oneEventDef, secondThingDef]);

type ThingEvents = T.TypeOf<typeof thingEventsDef>;

export class Thing implements Aggregator<ThingEvents, Thing> {
    public readonly foo: string;
    public readonly bar: number;

    // Force constructor to take *Created "genesis" event
    // Event must be created externally
    public constructor(event: OneEvent) {
        // TODO: Run `apply()` with `event`

        this.foo = 'something';
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

        // Persist self to DB if save is successful

        // TODO: Emit events on successful transaction

        return this;
    }
}
