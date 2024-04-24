import styled, { css } from 'styled-components';
import { forwardRef, MutableRefObject, Ref, useMemo, useRef } from 'react';
import DictionaryWord from 'features/DictionaryBook/ui/DictionaryWord';
import { Flex } from 'antd';
import { EWordTypes } from 'shared/enums';

interface IProps {
  ref: Ref<HTMLDivElement>;
  words: any;
  groupsCount: number;
}

export const DictionaryBook = forwardRef(
  ({ words, groupsCount }: IProps, ref: Ref<HTMLDivElement>) => {
    const wordsArray = useMemo(() => {
      if (!words) {
        return [];
      }
      const array = [];

      const getWordsArray = (words: any) =>
        words?.map((word: any) => (
          <DictionaryWord
            $leftMargin={groupsCount * 10}
            word={word.text}
            translations={word.phraseTranslates.reduce(
              (acc: string[], curr: any) => [...acc, curr.translationText],
              [],
            )}
            key={word.id}
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
              <DictionaryTitle $level={1} key={key}>
                {getTitle(key)}
              </DictionaryTitle>,
            );

            if (!Array.isArray(words)) {
              for (const key2 in words2) {
                const words3 = words2[key2];
                if (words2.hasOwnProperty(key2)) {
                  array.push(
                    <DictionaryTitle $level={2} key={key2}>
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
          <DictionaryPage>{wordsArray}</DictionaryPage>
          <Divider style={{ height: '100%' }}>
            <TopRectangle />
            <BottomRectangle />
          </Divider>
          <DictionaryPage></DictionaryPage>
        </Flex>
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
  max-width: calc(50% - 30px);
  padding: 10px 0;
`;

const DictionaryTitle = styled.div<{ $level: 1 | 2 }>`
  height: 40px;
  display: flex;
  align-items: center;

  ${({ $level }) =>
    $level === 1
      ? css`
          font-size: 28px;
        `
      : css`
          font-size: 22px;
          margin-left: 20px;
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
