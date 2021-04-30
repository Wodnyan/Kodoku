class HttpError extends Error {
  statusCode!: number;
  message!: string;
  isHttpErrorHandler!: boolean;
  constructor(message: string, statusCode: number) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.isHttpErrorHandler = true;
  }
}
export default HttpError;
