type Predicate<T> = (value:T) => boolean;
type Validator<T> = (value:T) => string | null;
type Rule<T> = (message:string) => Validator<T>;
type ValidatorGroup<T> = Array<Validator<T>> | Validator<T> | ValidatorSet<{[P in keyof T]:T[P]}>
type PredicateMap<T> = {[P in keyof T]:Predicate<T[P]>};
type RuleMap<T> = {[P in keyof T]:Rule<T[P]>};
type ValidationResult<T> = {
    readonly [P in keyof T]: Array<String> | ValidationResult<T[P]>;
}
type ValidatorSet<T> = {
    readonly [P in keyof T]: ValidatorGroup<T[P]>;
}


export function createRule<T>(predicate:Predicate<T>):Rule<T>{
    return (message:string) => (value:T) => predicate(value)
        ? null
        : message;
}


export function mapPredicatesToRules<T>(predicateMap:PredicateMap<T>):RuleMap<T>{
    return Object.keys(predicateMap).reduce(
        (acc, key) => {
            return {
                ...acc,
                [key]: createRule(predicateMap[key as keyof T])
            }
        },
        {}
    ) as RuleMap<T>;
}



export function validate<T>(ruleset:ValidatorSet<T>, data:T):ValidationResult<T>{
    return Object.keys(ruleset).reduce(
        (acc, key) => {
            var rule = ruleset[key as keyof T] as ValidatorGroup<any>;
            var value = data[key as keyof T];
            
            if(rule instanceof Array){
                const rules = rule;
                const results = rules.map(rule => rule(value)).filter(result => result)
                return results.length > 0
                    ? { ...acc, [key]:results }
                    : acc;
            }else if(rule instanceof Function){
                const result = rule(value);
                return result 
                    ? { ...acc, [key]: [result] }
                    : acc
            }else{
                const result = validate(rule, value);
                return Object.keys(result).length == 0
                    ? acc
                    : { ...acc, [key]:result } 
            }
        }, {}
    ) as ValidationResult<T>;

}


export function createValidator<T>(ruleset:ValidatorSet<T>):(data:T) => ValidationResult<T>{
    return (data:T) => validate(ruleset, data);
}

