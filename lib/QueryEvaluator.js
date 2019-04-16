"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_common_1 = require("ts-common");
var QueryValueType;
(function (QueryValueType) {
    QueryValueType[QueryValueType["STRING"] = 0] = "STRING";
    QueryValueType[QueryValueType["NUMBER"] = 1] = "NUMBER";
})(QueryValueType = exports.QueryValueType || (exports.QueryValueType = {}));
/**
 * A strongly typed query evaluator, that builds a query instance following a set
 * of specified rules and data types.
 */
class QueryEvaluator {
    static getQuery(query, spec) {
        const result = {};
        Object.keys(spec).forEach(key => {
            const lowerCaseKey = key.toLowerCase();
            if (!query[lowerCaseKey]) {
                // No hit on the query specification, throw an error if it's mandatory
                if (spec[key].isMandatory) {
                    throw new ts_common_1.CustomError(QueryEvaluator.InvalidQueryErrorCode, `query parameter ${key} is mandatory`);
                }
                // Is there a default value available?
                if (spec[key].defaultValue != undefined) {
                    result[key] = spec[key].defaultValue;
                }
            }
            else {
                // The query attribute is present, let's make sure it conforms to the rules
                const querySpec = spec[key];
                let queryValue;
                if (querySpec.type == QueryValueType.NUMBER) {
                    const asNumber = +query[key.toLowerCase()];
                    if (isNaN(asNumber)) {
                        throw new ts_common_1.CustomError(QueryEvaluator.InvalidQueryErrorCode, `query parameter ${key} must be a number`);
                    }
                    queryValue = asNumber;
                }
                else {
                    // Treat it as a string = any value is OK
                    queryValue = query[key.toLowerCase()];
                }
                // Are there any rules to apply?
                (querySpec.rules || []).forEach(rule => {
                    if (rule.triggerOn(result, queryValue)) {
                        throw new ts_common_1.CustomError(QueryEvaluator.InvalidQueryErrorCode, rule.message);
                    }
                });
                // Everything seems OK, add the value to the resulting query
                result[key] = queryValue;
            }
        });
        return result;
    }
}
QueryEvaluator.InvalidQueryErrorCode = 9980;
exports.QueryEvaluator = QueryEvaluator;
