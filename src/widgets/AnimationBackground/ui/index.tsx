import styled from 'styled-components';
import { COLOR_PRIMARY } from 'shared/const';
import { useEffect, useRef, useState } from 'react';

interface IAnimationnBackProps {
  itemColor?: string;
}

export const AnimationBackground = ({
  itemColor = '#181818',
}: IAnimationnBackProps) => {
  const animationRef = useRef<HTMLDivElement>();
  const [itemsArray, setItemsArray] = useState([]);

  useEffect(() => {
    if (animationRef.current) {
      const width = animationRef.current.clientWidth;
      const height = animationRef.current.clientHeight;
      let itemWidth = width / 16 - 2;

      const itemsCount = (width * height) / (itemWidth * itemWidth);

      setItemsArray(Array(Math.ceil(itemsCount + 16)).fill(0));
      // делаем +16 чтобы последняя строчка точно заполнилась
    }
  }, [animationRef]);
  return (
    <AnimationnWrapper ref={animationRef}>
      {itemsArray.map((_, index) => (
        <SquareItem $color={itemColor} key={index}></SquareItem>
      ))}
    </AnimationnWrapper>
  );
};

const AnimationnWrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
  overflow: hidden;

  &::before {
    @keyframes animate {
      0% {
        transform: translateY(-100%);
      }
      100% {
        transform: translateY(100%);
      }
    }

    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(#000, ${COLOR_PRIMARY}, #000);
    animation: animate 5s linear infinite;
  }
`;

const SquareItem = styled.span<{ $color: string }>`
  position: relative;
  display: block;
  width: calc(6.25vw - 2px);
  height: calc(6.25vw - 2px);
  background: ${({ $color }) => $color};
  z-index: 2;
  transition: 1.5s;

  &:hover {
    background: ${COLOR_PRIMARY};
    transition: 0s;
  }
`;
