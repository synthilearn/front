import styled from 'styled-components';
import { DictionaryBook } from 'features/DictionaryBook';

export const DictionaryWidget = () => {
  return (
    <DictionaryWrapper>
      <DictionaryBook />
    </DictionaryWrapper>
  );
};

const DictionaryWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
