export function getFieldErrors(zodResult) {
  const fieldErrors = {};
  zodResult.error.issues.forEach((issue) => {
    fieldErrors[issue.path[0]] = issue.message;
  });
  return fieldErrors;
}