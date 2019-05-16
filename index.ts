import * as T from 'io-ts';
import { Either, Left, Right } from 'funfix';

interface Entity {
    do_something(): void;
}

const thingDef = T.interface({
    foo: T.string,
    bar: T.Integer
});

type ThingProps = T.TypeOf<typeof thingDef>;

export class Thing implements Entity, ThingProps {
    public foo: string;
    public bar: number;

    public constructor(entity: ThingProps) {
        const { foo, bar } = entity;

        this.foo = foo;
        this.bar = bar;
    }

    public is_valid(): boolean {
        return thingDef.decode(this).map((r) => true).getOrElse(false)
    }

    public do_something(): void {
        console.log("I did something")
    }
}
