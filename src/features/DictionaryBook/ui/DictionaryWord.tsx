import styled from "styled-components";
import {Flex} from "antd";

interface IProps {
    word: string
    translations: string[]
}
 const DictionaryWord = ({word, translations}: IProps) => {
    return (
        <DictionaryWordWrapper align={'center'} gap={5}>
            <Word>{`${word} -`}</Word>
            <Translations>{translations.join(', ')}</Translations>
        </DictionaryWordWrapper>
    )
}

 export default DictionaryWord;

const DictionaryWordWrapper = styled(Flex)`
  font-size: 18px;
  height: 40px;
  cursor: pointer;
  padding: 0 15px;
  width: min-content;
  border-radius: 5px;
  transition: all .3s;
  
  &:hover {
    background: #30538A;
  }
`

const Word = styled.span`
  white-space: nowrap;
`

const Translations = styled.span`
  width: max-content;
  white-space: nowrap; /* Запрет переноса строки */
  overflow: hidden; /* Скрытие текста, который не помещается */
  text-overflow: ellipsis; /* Добавление троеточия в конце длинной строки */
`