"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandler {
    constructor(config) {
        this.config = config;
    }
    handle(rsp, error) {
        let statusCode = 500;
        let errorCode = 500;
        let message = error.message || 'Internal error';
        let stacktrace = null;
        if (this.config.logStacktrace && error.stack) {
            stacktrace = error.stack;
        }
        if (error.statusCode) {
            statusCode = error.statusCode < 1000 ? error.statusCode : 400;
            errorCode = error.statusCode;
        }
        const outboundError = { errorCode, message, stacktrace };
        console.error(`Error! ${JSON.stringify(outboundError)}`);
        rsp.status(statusCode).json(outboundError);
    }
}
exports.ErrorHandler = ErrorHandler;
