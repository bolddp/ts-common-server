import { CustomError } from 'ts-common';
import { Response } from 'express';
import { ErrorHandlerConfig } from './error/ErrorHandlerConfig';
export declare class ErrorHandler {
    config: ErrorHandlerConfig;
    constructor(config: ErrorHandlerConfig);
    handle(rsp: Response, error: CustomError): void;
}
