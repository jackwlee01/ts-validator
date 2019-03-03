"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
test('createRule', function () {
    var predicate = function (value) { return value > 5; };
    var rule = index_1.createRule(predicate)("Not greater than 5");
    expect(rule(6)).toBe(null);
    expect(rule(0)).toBe("Not greater than 5");
});
test('mapPredicatesToRules', function () {
    var rules = index_1.mapPredicatesToRules({
        greaterThanFive: function (value) { return value > 5; },
        isZero: function (value) { return value == 0; }
    });
    var greaterThanFive = rules.greaterThanFive("Not greater than 5");
    expect(greaterThanFive(6)).toBe(null);
    expect(greaterThanFive(0)).toBe("Not greater than 5");
    var isZero = rules.isZero("Not zero");
    expect(isZero(0)).toBe(null);
    expect(isZero(1)).toBe("Not zero");
});
test('validate', function () {
    var rules = index_1.mapPredicatesToRules({
        greaterThanFive: function (value) { return value > 5; },
        lessThanTen: function (value) { return value < 10; },
        isZero: function (value) { return value == 0; }
    });
    var greaterThanFive = rules.greaterThanFive("Not greater than 5");
    var lessThanTen = rules.lessThanTen("Not less than 10");
    var isZero = rules.isZero("Not zero");
    var validator = {
        first: greaterThanFive,
        second: [
            greaterThanFive,
            lessThanTen
        ],
        third: {
            forth: greaterThanFive,
            fifth: [
                greaterThanFive,
                lessThanTen
            ]
        }
    };
    var dataA = {
        first: 6,
        second: 6,
        third: {
            forth: 6,
            fifth: 6
        }
    };
    var resultA = index_1.validate(validator, dataA);
    expect(resultA).toEqual({});
    var dataB = {
        first: 4,
        second: 4,
        third: {
            forth: 4,
            fifth: 4
        }
    };
    var resultB = index_1.validate(validator, dataB);
    expect(resultB).toEqual({
        first: ["Not greater than 5"],
        second: ["Not greater than 5"],
        third: {
            forth: ["Not greater than 5"],
            fifth: ["Not greater than 5"]
        }
    });
});
