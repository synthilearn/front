import styled, { css } from 'styled-components';
import { COLOR_PRIMARY } from 'shared/const';
import { DownOutlined } from '@ant-design/icons';
import { Button, Flex, Modal, notification, Skeleton, Typography } from 'antd';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { IBackendRes, ITemplate } from 'shared/interfaces';
import { $api } from 'shared/api';
import { TemplateBlock } from 'entities/TemplateBlock';
import { useSidebarMenuState } from 'shared/states/useSidebarMenuState';

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

const { Text } = Typography;

export const TemplatesToolbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [creatingTemplate, setCreatingTemplate] = useState<ITemplate>();

  const setRefetchWorkareas = useSidebarMenuState(
    state => state.setRefetchWorkareas,
  );

  const { data: templatesData, isFetching } = useQuery({
    queryKey: ['templates'],
    queryFn: () => {
      return $api.get<IBackendRes<{ templates: ITemplate[] }>>(
        'workspace-service/v1/template/all',
      );
    },
  });

  const { mutate: createWorkarea, isPending: creatingWorkArea } = useMutation({
    mutationFn: (areaType: string) => {
      return $api.post(`workarea-service/v1/workarea/${'LEARN_LANGUAGE'}`);
    },
    onSuccess: async () => {
      setCreatingTemplate(undefined);
      setRefetchWorkareas(true);

      notification.success({
        message: undefined,
        description: 'Рабочая область успешно создана!',
      });
    },
  });

  const handleCollapsingToolbar = () => {
    setIsOpen(prev => !prev);
  };

  const handleSelectTemplateName = (templateName: string) => {
    setCreatingTemplate(
      templatesData?.data.resultData.templates.find(
        template => template.name === templateName,
      ),
    );
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
                selectCreatingTemplate={handleSelectTemplateName}
              />
            ),
          )
        : [1, 2, 3].map((elem, index) => <SkeletonButton key={elem} active />)}
      <CollapseButton
        $isRotate={!isOpen}
        onClick={handleCollapsingToolbar}
        size={'large'}
        type={'text'}
        icon={<DownOutlined />}
      ></CollapseButton>

      <Modal
        open={!!creatingTemplate}
        onCancel={() => setCreatingTemplate(undefined)}
        title={'Создание рабочей области'}
        centered
        okText={'Создать'}
        cancelText={'Отмена'}
        onOk={() => createWorkarea(creatingTemplate.type)}
      >
        <Flex vertical gap={10}>
          <Flex gap={5}>
            <Text strong>Название:</Text>
            <Text>{creatingTemplate?.name}</Text>
          </Flex>
          <Flex gap={5}>
            <Text strong>Описание:</Text>
            <Text>{creatingTemplate?.description}</Text>
          </Flex>
        </Flex>
      </Modal>
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
