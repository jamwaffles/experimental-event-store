import * as T from 'io-ts';
import { Either as FPEither } from 'fp-ts/lib/Either';
import { Either, Some, Left, Right, Future, Option, None } from 'funfix';

import { Event } from './types';
import { OneEvent, SecondThing, ThirdBlah } from './events';
// type ReduceClause<I, O> = (o: I) => O;
// type MatchClause<I> = (o: any) => o is I;
// type Reducer<I, O> = [MatchClause<I>, ReduceClause<I, O>];

// NOTE: `ENT` must be the class that implements `Aggregator`. See [here](https://stackoverflow.com/questions/36744033/how-to-reference-type-of-self-in-typescript-interface-for-a-iclonable-interface) for explanation
interface Aggregator<EV, ENT> {
    apply(event: EV, reducers: any): Either<string, Option<ENT>>;
}

/**
Transform an fp-ts `Either` into a funfix `Either`
*/
function transform<E, R>(e: FPEither<E, R>): Either<E, R> {
    return e.mapLeft(l => Left(l)).map(r => Right(r)).value;
}

const ThingEvents = T.union([OneEvent, SecondThing]);

type ThingEvents = T.TypeOf<typeof ThingEvents>;

function onEvent(entity: Thing, event: OneEvent): Option<Thing> {
    entity.foo = event.data.map(d => d.foo).getOrElse('Emptttyyyy')

    return Some(entity);
}

function onThing(entity: Thing, event: SecondThing): Option<Thing> {
    entity.foo = event.data.map(d => d.foo).getOrElse('Moar')

    return Some(entity);
}

type EventReducer<E extends Event> = [[E["event_namespace"], E["event_type"]], (entity: any, event: E) => any];

const reducers = [
    <EventReducer<OneEvent>>[
        ['one', 'Event'],
        onEvent
    ],
    <EventReducer<SecondThing>>[
        ['second', 'Thing'],
        onThing
    ]
]

export class Thing implements Aggregator<ThingEvents, Thing> {
    private changelog: ThingEvents[] = [];

    public foo: string;
    public bar: number;

    // Force constructor to take *Created "genesis" event
    // Event must be created externally
    public constructor(event: OneEvent) {
        this.foo = event.data.map(d => d.foo).getOrElse('Default!');
        this.bar = 100;

        this.changelog = [event];

        return this;
    }

    // Does not save events, returns SAME entitiy with event applied to it
    public apply(
        // TODO: Omit `OneEvent` creation event
        event: ThingEvents
    ): Either<string, Option<Thing>> {
        return transform(ThingEvents.decode(event))
            .swap()
            .map((errors: T.Errors) => errors.map(e => e.message).join(', '))
            .swap()
            .flatMap(() => {
                // const reducer = reducers.find(([[ns, ty], _]) => ns === event.event_namespace && ty === event.event_type);

                // if (reducer) {
                //     return Right(reducer[1](this, event))
                // } else {
                //     return Left(`Reducer for event ${event} not found`)
                // }

                const type = `${event.event_namespace}.${event.event_type}`;

                switch (type) {
                    case "one.Event":
                        return Right(onEvent(this, event as OneEvent))

                    case "second.Thing":
                        return Right(onThing(this, event as SecondThing))

                    default:
                        return Left(`Event type ${type} not supported`)
                }
            });

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
