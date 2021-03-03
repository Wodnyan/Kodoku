class ErrorHandler extends Error {
  statusCode!: number;
  message!: string;
  errors?: string[];

  constructor(statusCode: number, message: string, errors?: string[]) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
  }
}
export default ErrorHandler;
