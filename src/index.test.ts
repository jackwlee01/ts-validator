import { createRule, mapPredicatesToRules, validate } from './index'


test('createRule', () => {
    const predicate = (value:number) => value > 5;
    const rule = createRule(predicate)("Not greater than 5");
    
    expect(rule(6)).toBe(null);
    expect(rule(0)).toBe("Not greater than 5");
});



test('mapPredicatesToRules', () => {
    const rules = mapPredicatesToRules({
        greaterThanFive: (value:number) => value > 5,
        isZero: (value:number) => value == 0
    })

    const greaterThanFive = rules.greaterThanFive("Not greater than 5")
    expect(greaterThanFive(6)).toBe(null);
    expect(greaterThanFive(0)).toBe("Not greater than 5");

    const isZero =  rules.isZero("Not zero")
    expect(isZero(0)).toBe(null);
    expect(isZero(1)).toBe("Not zero");
});


test('validate', () => {
    const rules = mapPredicatesToRules({
        greaterThanFive: (value:number) => value > 5,
        lessThanTen: (value:number) => value < 10,
        isZero: (value:number) => value == 0
    })

    const greaterThanFive = rules.greaterThanFive("Not greater than 5")
    const lessThanTen = rules.lessThanTen("Not less than 10")
    const isZero = rules.isZero("Not zero")
    
    const validator = {
        first: greaterThanFive,
        second: [
            greaterThanFive,
            lessThanTen
        ],
        third:{
            forth:greaterThanFive,
            fifth:[
                greaterThanFive,
                lessThanTen
            ]
        }
    }

    const dataA = {
        first: 6,
        second: 6,
        third:{
            forth: 6,
            fifth: 6
        }
    }
    const resultA = validate(validator, dataA);
    expect(resultA).toEqual({});

    const dataB = {
        first: 4,
        second: 4,
        third: {
            forth: 4,
            fifth: 4
        }
    }
    const resultB = validate(validator, dataB);
    expect(resultB).toEqual({
        first: ["Not greater than 5"],
        second: ["Not greater than 5"],
        third:{
            forth: ["Not greater than 5"],
            fifth: ["Not greater than 5"]
        }
    })


})
