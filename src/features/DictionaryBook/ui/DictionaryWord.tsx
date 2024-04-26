import styled from 'styled-components';
import { Flex } from 'antd';
import { ITranslation } from 'shared/interfaces';

interface IProps {
  word: string;
  translations: ITranslation[] | null;
  $leftMargin: number;
}
const DictionaryWord = ({ word, translations, $leftMargin }: IProps) => {
  return (
    <DictionaryWordWrapper
      style={{ marginLeft: $leftMargin }}
      align={'center'}
      gap={5}
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
  white-space: nowrap; /* Запрет переноса строки */
  overflow: hidden; /* Скрытие текста, который не помещается */
  text-overflow: ellipsis; /* Добавление троеточия в конце длинной строки */
`;
