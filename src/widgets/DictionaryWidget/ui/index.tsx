import styled from 'styled-components';
import { DictionaryBook } from 'features/DictionaryBook';
import {AutoComplete, Button, Flex, Input, Pagination} from 'antd';
import {Ref, useEffect, useRef, useState} from "react";

export const DictionaryWidget = () => {
    const bookRef = useRef<null | HTMLDivElement>(null)
    const [wordsCount, setWordsCount] = useState<number>()


    useEffect(() => {
        if(bookRef.current) {
            const bookStyles = window.getComputedStyle(bookRef.current)
            const bookHeight = bookRef.current?.clientHeight - parseInt(bookStyles.paddingTop, 10) - parseInt(bookStyles.paddingBottom, 10) - 20
            // 20 это padding у DictionaryPage

            setWordsCount(Math.floor(bookHeight / 40) * 2)
        }
    },[bookRef])
    return (
        <DictionaryWrapper vertical gap={15}>
            <Flex justify={'space-between'}>
                <AutoComplete placeholder={'Поиск слова'} style={{width: '300px'}}/>
            <Button>Добавить слово</Button>
            </Flex>
            <DictionaryBook ref={bookRef}/>
            <Flex justify={'flex-end'}><Pagination defaultCurrent={1} total={50}/></Flex>
        </DictionaryWrapper>
    );
};

const DictionaryWrapper = styled(Flex)`
  flex-grow: 1;
  padding: 15px 3%;
`;
