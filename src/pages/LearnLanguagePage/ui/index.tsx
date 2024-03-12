import AreaSegmented from 'features/AreaSegmented';
import { DictionaryWidget } from 'widgets/DictionaryWidget';
import { useMemo, useState } from 'react';

const segmented = ['Словарь', 'Книги', 'Игры', 'Статистика'];

export const LearnLanguagePage = () => {
  const [segmentedValue, setSegmentedValue] =
    useState<keyof typeof ESegmented>('Словарь');

  const segmentedComponents = useMemo(
    () => [
      <DictionaryWidget />,
      <div>Книги</div>,
      <div>Игры</div>,
      <div>Статистика</div>,
    ],
    [],
  );

  const handleChangeSegmented = (value: keyof typeof ESegmented) => {
    setSegmentedValue(value);
  };
  return (
    <div>
      <AreaSegmented options={segmented} onChange={handleChangeSegmented} />
      {segmentedComponents[ESegmented[segmentedValue]]}
    </div>
  );
};

enum ESegmented {
  'Словарь',
  'Книги',
  'Игры',
  'Статистика',
}
