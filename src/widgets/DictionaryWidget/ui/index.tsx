import styled from 'styled-components';
import { DictionaryBook } from 'features/DictionaryBook';
import { AutoComplete, Button, Flex, Pagination } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import AddWordModal from 'features/AddWordModal';
import { useCurrentWorkarea } from 'shared/states/useCurrentWorkarea';
import { DictionarySettingsDrawer } from 'features/DictionarySettingsDrawer';
import { useQuery } from '@tanstack/react-query';
import { $api } from 'shared/api';
import { IBackendRes, IUserData } from 'shared/interfaces';

export const DictionaryWidget = () => {
  const bookRef = useRef<null | HTMLDivElement>(null);
  const [wordsCount, setWordsCount] = useState<number>();
  const [openAddWordModal, setOpenAddWordModal] = useState(false);
  const [openSettingsDrawer, setOpenSettingsDrawer] = useState(false);
  const currentWorkarea = useCurrentWorkarea(state => state.currentWorkarea);

  const dictionaryId = useMemo(() => {
    return currentWorkarea?.widgets?.find(
      widget => widget.type === 'DICTIONARY',
    )?.id;
  }, [currentWorkarea]);

  const {
    data: wordsData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['words'],
    enabled: !!wordsCount && !!dictionaryId,
    queryFn: () => {
      return $api.post<IBackendRes<any>>('dictionary-service/v1/phrase/all', {
        dictionaryId,
        page: 0,
        size: wordsCount,
        showTranslates: true,
        partsOfSpeech: [
          'NOUN',
          'PRONOUN',
          'VERB',
          'ADJECTIVE',
          'ADVERB',
          'PREPOSITION',
          'CONJUNCTION',
          'INTERJECTION',
          'OTHER',
        ],
        phraseTypes: ['WORD', 'PHRASE'],
        startDate: '2024-03-18',
        endDate: '2025-11-11',
        groups: ['PART_OF_SPEECH', 'LETTER'], //'PART_OF_SPEECH', 'LETTER'
      });
    },
  });

  useEffect(() => {
    if (bookRef.current) {
      const bookStyles = window.getComputedStyle(bookRef.current);
      const bookHeight =
        bookRef.current?.clientHeight -
        parseInt(bookStyles.paddingTop, 10) -
        parseInt(bookStyles.paddingBottom, 10) -
        20;
      // 20 это padding у DictionaryPage

      setWordsCount(Math.floor(bookHeight / 40) * 2);
    }
  }, [bookRef]);

  return (
    <DictionaryWrapper vertical gap={15}>
      <Flex justify={'space-between'}>
        <Flex gap={12}>
          <AutoComplete
            placeholder={'Поиск слова'}
            style={{ width: '300px' }}
          />
          <Button onClick={() => setOpenSettingsDrawer(true)}>
            Настроить словарь
          </Button>
        </Flex>
        <Button onClick={() => setOpenAddWordModal(true)}>
          Добавить слово
        </Button>
      </Flex>
      <DictionaryBook
        groupsCount={2}
        words={wordsData?.data?.resultData?.phrases}
        ref={bookRef}
      />
      <Flex justify={'flex-end'}>
        <Pagination defaultCurrent={1} total={50} />
      </Flex>
      <AddWordModal
        dictionaryId={dictionaryId}
        open={openAddWordModal}
        onClose={() => setOpenAddWordModal(false)}
      />
      <DictionarySettingsDrawer
        open={openSettingsDrawer}
        onClose={() => setOpenSettingsDrawer(false)}
      />
    </DictionaryWrapper>
  );
};

const DictionaryWrapper = styled(Flex)`
  flex-grow: 1;
  padding: 15px 3%;
`;
