import styled from 'styled-components';
import { DictionaryBook } from 'features/DictionaryBook';
import {
  AutoComplete,
  Button,
  Flex,
  Form,
  Input,
  InputRef,
  notification,
  Pagination,
  Select,
  Tag,
  theme,
  Tooltip,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import AddWordModal from 'features/AddWordModal';
import { useCurrentWorkarea } from 'shared/states/useCurrentWorkarea';

export const DictionaryWidget = () => {
  const bookRef = useRef<null | HTMLDivElement>(null);
  const [wordsCount, setWordsCount] = useState<number>();
  const [openAddWordModal, setOpenAddWordModal] = useState(false);
  const currentWorkarea = useCurrentWorkarea(state => state.currentWorkarea);

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

  console.log(currentWorkarea);
  return (
    <DictionaryWrapper vertical gap={15}>
      <Flex justify={'space-between'}>
        <AutoComplete placeholder={'Поиск слова'} style={{ width: '300px' }} />
        <Button onClick={() => setOpenAddWordModal(true)}>
          Добавить слово
        </Button>
      </Flex>
      <DictionaryBook ref={bookRef} />
      <Flex justify={'flex-end'}>
        <Pagination defaultCurrent={1} total={50} />
      </Flex>
      <AddWordModal
        dictionaryId={
          currentWorkarea?.widgets?.find(widget => widget.type === 'DICTIONARY')
            ?.id
        }
        open={openAddWordModal}
        onClose={() => setOpenAddWordModal(false)}
      />
    </DictionaryWrapper>
  );
};

const DictionaryWrapper = styled(Flex)`
  flex-grow: 1;
  padding: 15px 3%;
`;
