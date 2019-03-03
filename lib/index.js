"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
function createRule(predicate) {
    return function (message) { return function (value) { return predicate(value)
        ? null
        : message; }; };
}
exports.createRule = createRule;
function mapPredicatesToRules(predicateMap) {
    return Object.keys(predicateMap).reduce(function (acc, key) {
        var _a;
        return __assign({}, acc, (_a = {}, _a[key] = createRule(predicateMap[key]), _a));
    }, {});
}
exports.mapPredicatesToRules = mapPredicatesToRules;
function validate(ruleset, data) {
    return Object.keys(ruleset).reduce(function (acc, key) {
        var _a, _b, _c;
        var rule = ruleset[key];
        var value = data[key];
        if (rule instanceof Array) {
            var rules = rule;
            var results = rules.map(function (rule) { return rule(value); }).filter(function (result) { return result; });
            return results.length > 0
                ? __assign({}, acc, (_a = {}, _a[key] = results, _a)) : acc;
        }
        else if (rule instanceof Function) {
            var result = rule(value);
            return result
                ? __assign({}, acc, (_b = {}, _b[key] = [result], _b)) : acc;
        }
        else {
            var result = validate(rule, value);
            return Object.keys(result).length == 0
                ? acc
                : __assign({}, acc, (_c = {}, _c[key] = result, _c));
        }
    }, {});
}
exports.validate = validate;
function createValidator(ruleset) {
    return function (data) { return validate(ruleset, data); };
}
exports.createValidator = createValidator;
