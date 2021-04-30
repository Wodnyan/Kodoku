export class ValidationError extends Error {
  status!: number;
  errors?: Array<string>;
  isValidationError!: boolean;

  constructor(message: string, errors?: Array<string>) {
    super(message);
    this.status = 400;
    this.errors = errors;
    this.isValidationError = true;
  }
}
