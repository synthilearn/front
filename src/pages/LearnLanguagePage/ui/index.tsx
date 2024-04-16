import AreaSegmented from 'features/AreaSegmented';
import { DictionaryWidget } from 'widgets/DictionaryWidget';
import { useMemo, useState } from 'react';
import styled from 'styled-components';

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
        <PageWrapper>
            <AreaSegmented options={segmented} onChange={handleChangeSegmented} />
            {segmentedComponents[ESegmented[segmentedValue]]}
        </PageWrapper>
    );
};

enum ESegmented {
    'Словарь',
    'Книги',
    'Игры',
    'Статистика',
}

const PageWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
