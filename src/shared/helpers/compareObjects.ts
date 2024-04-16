export const nonStrictCompareObjects = (obj1: any, obj2: any): boolean => {
  if (!obj1 || !obj2) {
    return true;
  }
  // Получаем ключи объектов
  const keys1 = Object.keys(obj1);

  // Проверяем каждое свойство
  for (let key of keys1) {
    // Если значения свойств различаются, объекты не равны
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  // Если все проверки прошли успешно, объекты равны
  return true;
};
