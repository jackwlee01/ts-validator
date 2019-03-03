declare type Predicate<T> = (value: T) => boolean;
declare type Validator<T> = (value: T) => string | null;
declare type Rule<T> = (message: string) => Validator<T>;
declare type ValidatorGroup<T> = Array<Validator<T>> | Validator<T> | ValidatorSet<{
    [P in keyof T]: T[P];
}>;
declare type PredicateMap<T> = {
    [P in keyof T]: Predicate<T[P]>;
};
declare type RuleMap<T> = {
    [P in keyof T]: Rule<T[P]>;
};
declare type ValidationResult<T> = {
    readonly [P in keyof T]: Array<String> | ValidationResult<T[P]>;
};
declare type ValidatorSet<T> = {
    readonly [P in keyof T]: ValidatorGroup<T[P]>;
};
export declare function createRule<T>(predicate: Predicate<T>): Rule<T>;
export declare function mapPredicatesToRules<T>(predicateMap: PredicateMap<T>): RuleMap<T>;
export declare function validate<T>(ruleset: ValidatorSet<T>, data: T): ValidationResult<T>;
export declare function createValidator<T>(ruleset: ValidatorSet<T>): (data: T) => ValidationResult<T>;
export {};
