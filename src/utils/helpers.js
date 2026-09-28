
export function getFieldErrors(zodResult) {
  const fieldErrors = {};
  zodResult.error.issues.forEach((issue) => {
    fieldErrors[issue.path[0]] = issue.message;
  });
  return fieldErrors;
}

export function getPasswordChecks(pwd) {
  return {
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[^A-Za-z0-9]/.test(pwd),
  };
}