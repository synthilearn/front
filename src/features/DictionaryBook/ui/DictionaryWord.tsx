import styled from 'styled-components';
import { Flex } from 'antd';
import { ITranslation } from 'shared/interfaces';

interface IProps {
  word: string;
  translations: ITranslation[] | null;
  $leftMargin: number;
  wordId: string;
  setWordId: (wordId: string) => void;
}
const DictionaryWord = ({
  word,
  translations,
  $leftMargin,
  setWordId,
  wordId,
}: IProps) => {
  const handleClick = () => {
    setWordId(wordId);
  };
  return (
    <DictionaryWordWrapper
      style={{ marginLeft: $leftMargin }}
      align={'center'}
      gap={5}
      onClick={handleClick}
    >
      <Word>{`${word} ${!!translations ? '-' : ''}`}</Word>
      {translations && (
        <Translations>
          {translations
            .reduce(
              (acc: string[], curr: any) => [...acc, curr.translationText],
              [],
            )
            .join(', ')}
        </Translations>
      )}
    </DictionaryWordWrapper>
  );
};

export default DictionaryWord;

const DictionaryWordWrapper = styled(Flex)`
  font-size: 18px;
  height: 40px;
  cursor: pointer;
  padding: 0 15px;
  width: min-content;
  border-radius: 5px;
  transition: all 0.3s;

  &:hover {
    background: #30538a;
  }
`;

const Word = styled.span`
  white-space: nowrap;
`;

const Translations = styled.span`
  max-width: 350px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
