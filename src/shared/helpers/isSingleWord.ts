export const isSingleWordOrPhrase = (input: string): boolean => {
  // Удаляем все пробелы и запятые из строки
  const trimmedInput = input.replace(/\b(?:a|to)\s/gi, '').trimEnd();

  return trimmedInput.split(' ').length === 1;
};
