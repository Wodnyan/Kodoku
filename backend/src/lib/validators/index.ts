import { ValidationError } from "../../lib/exceptions/validation";
import { Schema } from "yup";

export const validateSchemaAsync = async (
  schema: Schema<any, any>,
  payload: any
) => {
  try {
    await schema.validate(payload, { abortEarly: false });
    return true;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new ValidationError(error.message, error.errors);
    }
    throw error;
  }
};
