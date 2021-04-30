export class ValidationError extends Error {
  statusCode!: number;
  errors?: Array<string>;
  isValidationError!: boolean;

  constructor(message: string, errors?: Array<string>) {
    super(message);
    this.statusCode = 400;
    this.errors = errors;
    this.isValidationError = true;
  }
}
