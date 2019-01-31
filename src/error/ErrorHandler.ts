import { CustomError } from 'ts-common';
import { Response } from 'express';
import { ErrorHandlerConfig } from './ErrorHandlerConfig';

export class ErrorHandler {
  config: ErrorHandlerConfig;

  constructor(config: ErrorHandlerConfig) {
    this.config = config;
  }

  handle(rsp: Response, error: CustomError): void {
    let statusCode: number = 500;
    let errorCode: number = 500;
    let message: string = error.message || this.config.defaultErrorMessage || 'Internal error';
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