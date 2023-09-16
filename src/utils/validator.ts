export const isNameValid = (name: string): boolean => {
  // Regular expression to match letters (uppercase and lowercase) and spaces
  const regex = /^[A-Za-z\s]+$/;

  return regex.test(name);
};
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  // Regular expression to match valid phone numbers
  const regex = /^(\+\d{1,})?\d+$/;

  return regex.test(phoneNumber);
};
