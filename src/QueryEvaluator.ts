import { CustomError } from "ts-common";

export type QueryAttributeType = string | number;
export type Query = { [key: string]: QueryAttributeType };

export enum QueryValueType {
  STRING,
  NUMBER
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

export type QuerySpec<T extends Query> = {
  [P in keyof T]: QueryEntry<T>;
}

/**
 * A strongly typed query evaluator, that builds a query instance following a set
 * of specified rules and data types.
 */
export class QueryEvaluator {
  static InvalidQueryErrorCode: number = 9980;

  static getQuery<T extends Query>(query: any, spec: QuerySpec<T>): T {
    const result: T = <T> {};
    Object.keys(spec).forEach(key => {
      const lowerCaseKey = key.toLowerCase();
      if (!query[lowerCaseKey]) {
        // No hit on the query specification, throw an error if it's mandatory
        if (spec[key].isMandatory) {
          throw new CustomError(QueryEvaluator.InvalidQueryErrorCode, `query parameter ${key} is mandatory`);
        }
        // Is there a default value available?
        if (spec[key].defaultValue != undefined) {
          result[key] = spec[key].defaultValue;
        }
      } else {
        // The query attribute is present, let's make sure it conforms to the rules
        const querySpec = spec[key];
        let queryValue: QueryAttributeType;
        if (querySpec.type == QueryValueType.NUMBER) {
          const asNumber = +query[key.toLowerCase()];
          if (isNaN(asNumber)) {
            throw new CustomError(QueryEvaluator.InvalidQueryErrorCode, `query parameter ${key} must be a number`);
          }
          queryValue = asNumber;
        } else {
          // Treat it as a string = any value is OK
          queryValue = query[key.toLowerCase()];
        }
        // Are there any rules to apply?
        (querySpec.rules || []).forEach(rule => {
          if (rule.triggerOn(result, queryValue)) {
            throw new CustomError(QueryEvaluator.InvalidQueryErrorCode, rule.message);
          }
        });
        // Everything seems OK, add the value to the resulting query
        result[key] = queryValue;
      }
    });
    return result;
  }
}