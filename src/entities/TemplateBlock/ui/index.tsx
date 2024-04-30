import styled, { css } from 'styled-components';
import { COLOR_DARK, COLOR_TEXT_DISABLED } from 'shared/const';
import React from 'react';
import { LockOutlined } from '@ant-design/icons';

interface IToolbarTemplate {
  name: string;
  description: string;
  hide: boolean;
  transitionDelay: number;
  isFake?: boolean;
  selectCreatingTemplate: (templateName: string) => void;
}

export const TemplateBlock = ({
  name,
  description,
  hide,
  transitionDelay,
  isFake = false,
  selectCreatingTemplate,
}: IToolbarTemplate) => {
  const handleClick = () => {
    if (!isFake) {
      selectCreatingTemplate(name);
    }
  };
  return (
    <TemplateWrapper
      $isHide={hide}
      $transitionDelay={transitionDelay}
      $isFake={isFake}
      onClick={handleClick}
    >
      <span className="template-title">{name}</span>
      {isFake && (
        <LockIconWrapper>
          <LockOutlined className="icon-wrapper" style={{ fontSize: '40px' }} />
        </LockIconWrapper>
      )}
    </TemplateWrapper>
  );
};

const TemplateWrapper = styled.div<{
  $isHide: boolean;
  $transitionDelay: number;
  $isFake: boolean;
}>`
  width: 220px;
  height: 88px;
  position: relative;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${COLOR_DARK};
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  top: 0;
  left: 0;
  font-weight: 600;
  transition:
    all 0.3s,
    transform 0.3s;
  transition-delay: ${({ $transitionDelay }) => $transitionDelay}s, 0s;

  span.icon-wrapper {
    opacity: 0;
    transition: all 0.3s;
  }

  span.template-title {
    transition: all 0.2s;
  }

  &:hover {
    transition-delay: 1ms;
    transform: scale(1.05);
    color: ${COLOR_TEXT_DISABLED};

    ${({ $isFake }) =>
      $isFake &&
      css`
        span.icon-wrapper {
          opacity: 1;
          transform: scale(1.3);
          color: red;
        }

        span.template-title {
          opacity: 0;
        }
      `}
  }

  ${({ $isHide }) =>
    $isHide &&
    css`
      top: -200px;
    `}

  ${({ $isFake }) =>
    $isFake &&
    css`
      color: ${COLOR_TEXT_DISABLED};
    `}
`;

const LockIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  opacity: 0.5;
  transition: all 0.2s;
`;
