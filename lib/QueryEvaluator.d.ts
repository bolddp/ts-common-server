export declare type QueryAttributeType = string | number;
export declare type Query = {
    [key: string]: QueryAttributeType;
};
export declare enum QueryValueType {
    STRING = 0,
    NUMBER = 1
}
/**
 * A query rule, that can be used to find invalid query value combinations,
 * e.g. a max value being smaller than a min value.
 *
 * The triggerOn method is feed with the current contents of the query, so
 * if values are to compared to each other, like min and max values, the rule
 * must be placed on the last of the values so the previous value has been
 * determined before the rule is applied.
 */
export interface QueryRule<T> {
    /**
     * Expression that triggers an error if it evaluates to True
     */
    triggerOn: (query: T, value: QueryAttributeType) => boolean;
    /**
     * The error message that should be thrown if the rule check fails
     */
    message: string;
}
interface QueryEntry<T> {
    type: QueryValueType;
    defaultValue?: QueryAttributeType;
    rules?: QueryRule<T>[];
    isMandatory?: boolean;
}
export declare type QuerySpec<T extends Query> = {
    [P in keyof T]: QueryEntry<T>;
};
/**
 * A strongly typed query evaluator, that builds a query instance following a set
 * of specified rules and data types.
 */
export declare class QueryEvaluator {
    static InvalidQueryErrorCode: number;
    static getQuery<T extends Query>(query: any, spec: QuerySpec<T>): T;
}
export {};
