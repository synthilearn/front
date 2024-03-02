import styled, { css } from 'styled-components';
import { COLOR_PRIMARY } from 'shared/const';
import { DownOutlined } from '@ant-design/icons';
import { Button, Skeleton } from 'antd';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IBackendRes, ITemplate } from 'shared/interfaces';
import { $api } from 'shared/api';
import { TemplateBlock } from 'entities/TemplateBlock';

const fakeTemplates = [
  {
    name: 'Скоро появится',
    description: 'рабочая область находится в разработке!',
    isFake: true,
  },
  {
    name: 'Скоро появится',
    description: 'рабочая область находится в разработке!',
    isFake: true,
  },
];

export const TemplatesToolbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { data: templatesData, isFetching } = useQuery({
    queryKey: [],
    queryFn: () => {
      return $api.get<IBackendRes<{ templates: ITemplate[] }>>(
        'workspace-service/v1/template/all',
      );
    },
  });

  const handleCollapsingToolbar = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <ToolbarWrapper $isOpen={isOpen}>
      {!isFetching && templatesData
        ? [...templatesData?.data?.resultData?.templates, ...fakeTemplates].map(
            ({ name, description, isFake }, index) => (
              <TemplateBlock
                name={name}
                description={description}
                key={index}
                hide={!isOpen}
                isFake={isFake}
                transitionDelay={index / 4}
              />
            ),
          )
        : [1, 2, 3].map((elem, index) => <SkeletonButton active />)}
      <CollapseButton
        $isRotate={!isOpen}
        onClick={handleCollapsingToolbar}
        size={'large'}
        type={'text'}
        icon={<DownOutlined />}
      ></CollapseButton>
    </ToolbarWrapper>
  );
};

const ToolbarWrapper = styled.div<{ $isOpen: boolean }>`
  height: 120px;
  padding: 15px 30px;
  display: flex;
  gap: 24px;
  background-color: ${COLOR_PRIMARY};
  border-left: 2px solid #1b5583;
  border-top: 2px solid #1b5583;
  position: relative;
  transition: all 0.3s;
  transition-delay: ${({ $isOpen }) => ($isOpen ? 0 : 0.75)}s;
  overflow: hidden;

  ${({ $isOpen }) =>
    !$isOpen &&
    css`
      height: 50px;
    `}
`;

const CollapseButton = styled(Button)<{ $isRotate: boolean }>`
  position: absolute;
  top: 6px;
  right: 20px;
  transition: all 0.2s;

  ${({ $isRotate }) =>
    $isRotate &&
    css`
      transform: rotate(180deg);
    `}
`;

const SkeletonButton = styled(Skeleton.Button)`
  span {
    width: 200px !important;
    height: 88px !important;
    border-radius: 10px !important;
  }
`;
