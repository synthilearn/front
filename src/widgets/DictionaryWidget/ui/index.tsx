import styled from 'styled-components';
import { DictionaryBook } from 'features/DictionaryBook';
import { AutoComplete, Button, Flex, Pagination } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import AddWordModal from 'features/AddWordModal';
import { useCurrentWorkarea } from 'shared/states/useCurrentWorkarea';
import { DictionarySettingsDrawer } from 'features/DictionarySettingsDrawer';
import { useQuery } from '@tanstack/react-query';
import { $api } from 'shared/api';
import { IBackendRes, IUserData, IWordsData } from 'shared/interfaces';
import { useDictionaryState } from 'widgets/DictionaryWidget/state/useDictionaryState';
import SearchWordAutocomplete from 'features/SearchWordAutocomplete';
import TemplatesModal from 'features/TemplatesModal';

export const DictionaryWidget = () => {
  const [page, setPage] = useState<number>(0);
  const [lastPage, setLastPage] = useState(0);
  const bookRef = useRef<null | HTMLDivElement>(null);
  const [wordsCount, setWordsCount] = useState<number>();
  const [openAddWordModal, setOpenAddWordModal] = useState(false);
  const [openTemplatesModal, setOpenTemplatesModal] = useState(false);
  const [openSettingsDrawer, setOpenSettingsDrawer] = useState(false);
  const currentWorkarea = useCurrentWorkarea(state => state.currentWorkarea);
  const getDictionarySettings = useDictionaryState(
    state => state.getDictionarySettings,
  );
  const dictionarySettings = useDictionaryState(
    state => state.dictionarySettings,
  );

  const dictionaryId = useMemo(() => {
    return currentWorkarea?.widgets?.find(
      widget => widget.type === 'DICTIONARY',
    )?.id;
  }, [currentWorkarea]);

  const {
    data: wordsData,
    isFetching,
    refetch: refetchWords,
  } = useQuery({
    queryKey: ['words', page],
    enabled: !!dictionaryId && !!wordsCount && !!dictionarySettings,
    queryFn: () => {
      return $api.post<IBackendRes<IWordsData>>(
        'dictionary-service/v1/phrase/all',
        {
          dictionaryId,
          page,
          size: wordsCount,
          ...dictionarySettings,
        },
      );
    },
  });

  const { data: _ } = useQuery({
    queryKey: ['words', wordsData?.data],
    enabled: !!wordsData?.data?.resultData?.totalPages && !!wordsCount,
    queryFn: () => {
      return $api.post<IBackendRes<IWordsData>>(
        'dictionary-service/v1/phrase/all',
        {
          dictionaryId,
          page: wordsData?.data?.resultData?.totalPages - 1,
          size: wordsCount,
          ...dictionarySettings,
        },
      );
    },
  });

  const onCloseTemplatesModal = () => {
    setOpenTemplatesModal(false);
  };

  const changePage = (page: number) => {
    setPage(page - 1);
  };

  useEffect(() => {
    if (_?.data?.resultData && !_?.data?.resultData?.phrases) {
      setLastPage(prev => prev - 1);
    }
  }, [_?.data?.resultData]);

  useEffect(() => {
    if (dictionaryId) {
      getDictionarySettings(dictionaryId);
    }
  }, [dictionaryId]);

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

  useEffect(() => {
    if (wordsData?.data) {
      setLastPage(wordsData?.data?.resultData?.totalPages);
    }
  }, [wordsData?.data]);

  return (
    <DictionaryWrapper vertical gap={15}>
      <Flex justify={'space-between'}>
        <Flex gap={12}>
          <SearchWordAutocomplete refetchWords={refetchWords} />
          <Button onClick={() => setOpenSettingsDrawer(true)}>
            Настроить словарь
          </Button>
        </Flex>
        <Flex gap={15}>
          <Button onClick={() => setOpenTemplatesModal(true)}>Шаблоны</Button>
          <Button onClick={() => setOpenAddWordModal(true)}>
            Добавить слово
          </Button>
        </Flex>
      </Flex>
      <DictionaryBook
        refetchWords={refetchWords}
        wordsCount={wordsCount}
        groupsCount={2}
        words={wordsData?.data?.resultData?.phrases}
        ref={bookRef}
        loadingWords={isFetching}
      />
      <Flex justify={'flex-end'}>
        <Pagination
          current={page + 1}
          total={wordsCount * lastPage}
          pageSize={wordsCount}
          onChange={changePage}
          showSizeChanger={false}
        />
      </Flex>
      <AddWordModal
        refetchWords={refetchWords}
        dictionaryId={dictionaryId}
        open={openAddWordModal}
        onClose={() => setOpenAddWordModal(false)}
      />
      <TemplatesModal
        refetchWords={refetchWords}
        open={openTemplatesModal}
        onClose={onCloseTemplatesModal}
      />
      <DictionarySettingsDrawer
        refetchWords={refetchWords}
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
