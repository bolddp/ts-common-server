export interface ErrorHandlerConfig {
  /**
   * Error message that is used if the handled error doesn't have a message of its own.
   */
  defaultErrorMessage: string;

  /**
   * Indicates if a log trace should be logged together with the statusCode and message.
   */
  logStacktrace: boolean;
}