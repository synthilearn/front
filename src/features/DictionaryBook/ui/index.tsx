import styled, { css } from 'styled-components';
import {
  forwardRef,
  MutableRefObject,
  Ref,
  useMemo,
  useRef,
  useState,
} from 'react';
import DictionaryWord from 'features/DictionaryBook/ui/DictionaryWord';
import { Flex } from 'antd';
import { EWordTypes } from 'shared/enums';
import { ITranslation, IWord } from 'shared/interfaces';
import ViewWordModal from 'features/ViewWordModal';
import { useCurrentWorkarea } from 'shared/states/useCurrentWorkarea';

interface IProps {
  ref: Ref<HTMLDivElement>;
  words: any;
  groupsCount: number;
  wordsCount: number | undefined;
  refetchWords: () => void;
}

export const DictionaryBook = forwardRef(
  (
    { words, groupsCount, wordsCount, refetchWords }: IProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const [selectedWordId, setSelectedWordId] = useState<string>();

    const currentWorkarea = useCurrentWorkarea(state => state.currentWorkarea);

    const dictionaryId = useMemo(() => {
      return currentWorkarea?.widgets?.find(
        widget => widget.type === 'DICTIONARY',
      )?.id;
    }, [currentWorkarea]);

    const wordsArray = useMemo(() => {
      if (!words) {
        return [];
      }
      const array = [];

      const getWordsArray = (words: IWord[]) =>
        words?.map((word: any) => (
          <DictionaryWord
            $leftMargin={groupsCount * 10}
            word={word.text}
            wordId={word.id}
            setWordId={setSelectedWordId}
            translations={word.phraseTranslates}
            key={
              word.id +
              word.phraseTranslates.map(
                (translation: ITranslation) => translation.translationText,
              )
            }
          />
        ));

      const getTitle = (key: string) => {
        return Object.keys(EWordTypes).includes(key)
          ? EWordTypes[key as keyof typeof EWordTypes]
          : key;
      };

      if (!Array.isArray(words)) {
        for (const key in words) {
          if (words.hasOwnProperty(key)) {
            const words2 = words[key];
            array.push(
              <DictionaryTitle $level={1} key={key + String(Math.random())}>
                {getTitle(key)}
              </DictionaryTitle>,
            );

            if (!Array.isArray(words2)) {
              for (const key2 in words2) {
                if (words2.hasOwnProperty(key2)) {
                  const words3 = words2[key2];
                  array.push(
                    <DictionaryTitle
                      $level={2}
                      key={key2 + String(Math.random())}
                    >
                      {getTitle(key2)}
                    </DictionaryTitle>,
                  );
                  array.push(...getWordsArray(words3));
                }
              }
            } else {
              array.push(...getWordsArray(words2));
            }
          }
        }
      } else {
        return getWordsArray(words);
      }
      return array;
    }, [words]);

    return (
      <DictionaryBookWrapper ref={ref}>
        <Flex style={{ height: '100%' }} gap={30}>
          <DictionaryPage>{wordsArray.slice(0, wordsCount / 2)}</DictionaryPage>
          <Divider style={{ height: '100%' }}>
            <TopRectangle />
            <BottomRectangle />
          </Divider>
          <DictionaryPage>{wordsArray.slice(wordsCount / 2)}</DictionaryPage>
        </Flex>
        <ViewWordModal
          wordId={selectedWordId}
          onClose={() => setSelectedWordId(undefined)}
          dictionaryId={dictionaryId}
          refetchWords={refetchWords}
        />
      </DictionaryBookWrapper>
    );
  },
);

const DictionaryBookWrapper = styled.div`
  background: #3e5f8a;
  border-radius: 20px;
  flex-grow: 1;
  padding: 2% 5%;
  width: 100%;
`;

const DictionaryPage = styled.div`
  height: 100%;
  flex-grow: 0.45;
  width: calc(50% - 30px);
  padding: 10px 0;
`;

const DictionaryTitle = styled.div<{ $level: 1 | 2 }>`
  height: 40px;
  display: flex;
  align-items: center;
  font-weight: 500;

  ${({ $level }) =>
    $level === 1
      ? css`
          font-size: 28px;
          color: rgba(255, 255, 255, 0.4);
        `
      : css`
          font-size: 22px;
          margin-left: 20px;
          color: rgba(255, 255, 255, 0.6);
        `}
`;

const Divider = styled.div`
  height: 100%;
  position: relative;
  width: 4px;
  background: #ffff;
  &::before {
    content: '';
    position: absolute;
    left: 2px;
    top: 10px;
    transform: translate(-50%, -100%);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 20px solid #fff;
  }

  &::after {
    content: '';
    position: absolute;
    left: 2px;
    bottom: 10px; /* Положение треугольника */
    transform: translate(-50%, 100%);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 20px solid #fff;
  }
`;

const TopRectangle = styled.span`
  position: absolute;
  top: 0;
  left: 50%;
  width: 6px;
  height: 50px;
  background: #ffff;
  transform: translateX(-50%);
`;

const BottomRectangle = styled.span`
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 6px;
  height: 50px;
  background: #ffff;
  transform: translateX(-50%);
`;
