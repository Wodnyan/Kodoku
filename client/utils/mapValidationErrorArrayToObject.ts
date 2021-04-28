export function mapValidationErrorArrayToObject(
  errorArray: Array<string>,
  fields: Array<string>
): any {
  const validationErrors = {};

  // Loop over fields
  for (let i = 0; i < fields.length; i++) {
    // Get the first error that contains the field
    for (let j = 0; j < errorArray.length; j++) {
      if (errorArray[j].toLowerCase().includes(fields[i].toLowerCase())) {
        validationErrors[fields[i]] = errorArray[j];
        break;
      }
    }
  }

  return validationErrors;
}
