"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = __importDefault(require("ava"));
var _1 = require(".");
ava_1.default('Validation', function (t) {
    var valid = {
        foo: "Strang",
        bar: 1010
    };
    var invalid = {
        foo: 1001,
        bar: "Number"
    };
    var thing_valid = new _1.Thing(valid);
    var thing_invalid = new _1.Thing(invalid);
    t.true(thing_valid.is_valid());
    t.false(thing_invalid.is_valid());
});
