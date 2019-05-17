"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var T = __importStar(require("io-ts"));
exports.oneEventDef = T.interface({
    event_namespace: T.literal('one'),
    event_type: T.literal('Event'),
    foo: T.string,
});
exports.secondThingDef = T.interface({
    event_namespace: T.literal('second'),
    event_type: T.literal('Thing'),
    bar: T.number,
});
exports.thirdBlahDef = T.interface({
    event_namespace: T.literal('third'),
    event_type: T.literal('Blah'),
    unrelated_crap: T.string
});
