export const jsonParser = (field: string | string[]): string[] | string => {
  if (field && typeof field === 'string') {
    return JSON.parse(field);
  }
  return '';
};
