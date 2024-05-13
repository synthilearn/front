import styled, { css } from 'styled-components';
import { COLOR_TEXT } from 'shared/const';

interface IProps {
  onClick: (option: string) => void;
  optionText: string;
  selectedWord: string | undefined;
  rightWord: string | undefined;
}

const AnswerOption = ({
  optionText,
  onClick,
  selectedWord,
  rightWord,
}: IProps) => {
  return (
    <AnswerOptionWrapper
      $noHover={!!selectedWord}
      $status={
        !rightWord ||
        !selectedWord ||
        (optionText !== rightWord && selectedWord !== optionText)
          ? 'default'
          : optionText === rightWord
            ? 'right'
            : 'wrong'
      }
      onClick={() => onClick(optionText)}
    >
      {optionText}
    </AnswerOptionWrapper>
  );
};

const AnswerOptionWrapper = styled.div<{
  $status: 'right' | 'wrong' | 'default';
  $noHover: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  transition: all 0.5s ease;
  border: solid 2px ${COLOR_TEXT};
  border-radius: 5px;
  cursor: pointer;

  ${({ $noHover }) =>
    !$noHover &&
    css`
      &:hover {
        transform: scale(1.1);
        color: #dbdbdb;
        border-color: #dbdbdb;
      }
    `}

  ${({ $status }) =>
    $status === 'right'
      ? css`
          color: green;
          border-color: green;
          transform: scale(1.1);
        `
      : $status === 'wrong' &&
        css`
          color: red;
          border-color: red;
        `}
`;

export default AnswerOption;
