export const getEmailParts = (value = "") =>
  value.toLowerCase().split(/[@._-]+/).filter(Boolean);