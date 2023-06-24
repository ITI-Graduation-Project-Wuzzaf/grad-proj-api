export const jsonParser = (field: string | string[]): string[] | string => {
  if (field && typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (err) {
      return '';
    }
  }
  return '';
};
