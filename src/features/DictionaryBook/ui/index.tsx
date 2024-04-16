import styled from 'styled-components';
import {forwardRef, MutableRefObject, Ref, useRef} from "react";
import DictionaryWord from "features/DictionaryBook/ui/DictionaryWord";
import {Flex} from "antd";

interface IProps {
  ref: Ref<HTMLDivElement>;
}

export const DictionaryBook = forwardRef(({}: IProps, ref: Ref<HTMLDivElement>) => {
  const book = useRef()
  return <DictionaryBookWrapper ref={ref}>
    <Flex style={{height: '100%'}} gap={30}>
      <DictionaryPage >
        <div style={{fontSize: '28px', height: '40px'}}>A</div>
        <DictionaryWord word={'Мама'} translations={['mom', 'mommy' ]}/>
        <DictionaryWord word={'Папа'} translations={['papik', 'father' ]}/>

      </DictionaryPage>
      <Divider style={{height: '100%'}}>
        <TopRectangle/>
        <BottomRectangle/>
      </Divider>
      <DictionaryPage></DictionaryPage>
    </Flex>
  </DictionaryBookWrapper>;
});

const DictionaryBookWrapper = styled.div`
  background: #3e5f8a;
  border-radius: 20px;
  flex-grow: 1;
  padding: 2% 5%;
  width: 100%;
`;

const DictionaryPage = styled.div`
 height: 100%;
  flex-grow:              0.45;
  max-width:              calc(50% - 30px);
  padding: 10px 0;
`

const Divider = styled.div`
height: 100%;
  position:             relative;
  width:          4px;
  background: #ffff;
  &::before {
    content: '';
    position: absolute;
    left: 2px;
    top: 10px;
    transform:                translate(-50%, -100%);
    border-left: 10px solid transparent; 
    border-right: 10px solid transparent; 
    border-bottom: 20px solid #fff; 
  }

  &::after {
    content: '';
    position: absolute;
    left: 2px;
    bottom: 10px; /* Положение треугольника */
    transform:                translate(-50%, 100%);
    border-left: 10px solid transparent; 
    border-right: 10px solid transparent; 
    border-top: 20px solid #fff; 
  }
`

const TopRectangle = styled.span`
position: absolute;
  top: 0;
  left: 50%;
  width:          6px;
  height: 50px;
  background: #ffff;
  transform: translateX(-50%);
`

const BottomRectangle = styled.span`
position: absolute;
  bottom: 0;
  left: 50%;
  width:          6px;
  height: 50px;
  background: #ffff;
  transform: translateX(-50%);
`
