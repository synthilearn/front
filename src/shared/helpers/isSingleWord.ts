export const isSingleWordOrPhrase = (input: string): boolean => {
  // Удаляем все пробелы и запятые из строки
  const trimmedInput = input.replace(/\s|,/g, '');

  // Проверяем, содержит ли строка только одно слово, исключая частицы "a" и "to"
  const isSingleWord = /^(?!.*\ba\b)(?!.*\bto\b)[a-zA-Z]+$/.test(trimmedInput);

  return isSingleWord;
};
