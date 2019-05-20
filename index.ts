import * as T from 'io-ts';
import { Either as FPEither } from 'fp-ts/lib/Either';
import { Either, Left, Right, Future } from 'funfix';

import { OneEvent, oneEventDef, secondThingDef, thirdBlahDef } from './events';
type ReduceClause<I, O> = (o: I) => O;
type MatchClause<I> = (o: any) => o is I;
type Reducer<I, O> = [MatchClause<I>, ReduceClause<I, O>];

// NOTE: `ENT` must be the class that implements `Aggregator`. See [here](https://stackoverflow.com/questions/36744033/how-to-reference-type-of-self-in-typescript-interface-for-a-iclonable-interface) for explanation
interface Aggregator<EV, ENT> {
    apply(event: EV): Either<string, ENT>;
}

/**
Transform an fp-ts `Either` into a funfix `Either`
*/
function transform<E, R>(e: FPEither<E, R>): Either<E, R> {
    return e.mapLeft(l => Left(l)).map(r => Right(r)).value;
}

const ThingEvents = T.union([oneEventDef, secondThingDef]);

type ThingEvents = T.TypeOf<typeof ThingEvents>;

export class Thing implements Aggregator<ThingEvents, Thing> {
    private changelog: ThingEvents[] = [];

    public readonly foo: string;
    public readonly bar: number;

    // Force constructor to take *Created "genesis" event
    // Event must be created externally
    public constructor(event: OneEvent) {
        this.foo = event.data.foo;
        this.bar = 100;

        this.changelog = [event];

        return this;
    }

    // Does not save events, returns SAME entitiy with event applied to it
    public apply(
        // TODO: Omit `OneEvent` creation event
        event: ThingEvents
    ): Either<string, Thing> {
        return transform(ThingEvents.decode(event))
            .map(() => {
                return this;
            })
            .swap()
            .map(() => 'BOOm')
            .swap();

        // TODO: Apply `event` using aggregate event handler thingies

        // TODO: Keep changelog of applied events since read

        // TODO: Why on earth does this need `as Thing`?!
        // return Right(this as Thing)
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
