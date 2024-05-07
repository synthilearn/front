import AreaSegmented from 'features/AreaSegmented';
import { DictionaryWidget } from 'widgets/DictionaryWidget';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const segmented = ['Словарь', 'Книги', 'Игра', 'Статистика'];

enum ESegmented {
  'Словарь' = 'dictionary',
  'Книги' = 'books',
  'Игра' = 'game',
  'Статистика' = 'statistics',
}

export const LearnLanguagePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentSegment, setCurrentSegment] =
    useState<keyof typeof ESegmented>('Словарь');

  const handleChangeSegmented = (value: keyof typeof ESegmented) => {
    navigate(ESegmented[value]);
    setCurrentSegment(value);
  };

  useEffect(() => {
    const segmentedObject = Object(ESegmented);
    const currentWidget = Object.values(ESegmented).find(key =>
      location.pathname.includes(key),
    );

    if (currentWidget) {
      for (const key in segmentedObject) {
        if (currentWidget === segmentedObject[key]) {
          setCurrentSegment(key as keyof typeof ESegmented);
        }
      }
    } else {
      navigate('dictionary');
    }
  }, [location.pathname]);
  return (
    <PageWrapper>
      <AreaSegmented
        options={segmented}
        onChange={handleChangeSegmented}
        value={currentSegment}
      />
      <Outlet />
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
