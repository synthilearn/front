import styled from 'styled-components';
import { DictionaryBook } from 'features/DictionaryBook';
import { Flex, Input } from 'antd';

export const DictionaryWidget = () => {
    return (
        <DictionaryWrapper vertical gap={30}>
            <Input />
            <DictionaryBook />
        </DictionaryWrapper>
    );
};

const DictionaryWrapper = styled(Flex)`
  flex-grow: 1;
  padding: 3%;
`;
