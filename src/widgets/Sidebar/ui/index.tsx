import styled, { css } from 'styled-components';
import { COLOR_PRIMARY, COLOR_TEXT } from 'shared/const';
import { MenuFoldOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import SidebarBody from 'widgets/Sidebar/ui/SidebarBody';
import { SidebarFooter } from 'widgets/Sidebar/ui/SidebarFooter';
import { IAreaItem, IBackendRes, IWorkarea } from 'shared/interfaces';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { $api } from 'shared/api';
import { useEffect, useMemo } from 'react';
import { useSidebarMenuState } from 'shared/states/useSidebarMenuState';
import { useCurrentWorkarea } from 'shared/states/useCurrentWorkarea';

interface ISidebarProps {
  siderIsOpen: boolean;
  changeOpenSider: () => void;
}

const areaRoutes: any = {
  'Изучение языков': '/active-area/learn-language',
};

const deactiveAreas: IAreaItem[] = [];

export const Sidebar = ({ changeOpenSider, siderIsOpen }: ISidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRefetch = useSidebarMenuState(state => state.refetchWorkareas);
  const setIsRefetch = useSidebarMenuState(state => state.setRefetchWorkareas);
  const getCurrentWorkarea = useCurrentWorkarea(
    state => state.getCurrentWorkarea,
  );

  const { data: workareasData, refetch: refetchWorkareas } = useQuery({
    queryKey: ['workareas'],
    queryFn: () => {
      return $api.get<IBackendRes<IWorkarea[]>>(
        'workarea-service/v1/workarea/all',
      );
    },
  });

  const activeAreas = useMemo(() => {
    if (workareasData?.data?.resultData) {
      return workareasData?.data?.resultData?.map((area: any) => ({
        label: area.name,
        clickLink: areaRoutes[area.name as any],
      }));
    }
    return [];
  }, [workareasData?.data]);

  const goToMainPage = () => {
    navigate('/');
  };

  useEffect(() => {
    const handleRefetchWorkareas = async () => {
      await refetchWorkareas();
      setIsRefetch(false);
    };
    if (isRefetch) {
      handleRefetchWorkareas();
    }
  }, [isRefetch]);

  useEffect(() => {
    let neededKey: string;
    for (const key in areaRoutes) {
      if (location.pathname.includes(areaRoutes[key])) {
        neededKey = key;
      }
    }
    if (neededKey) {
      const currentWorkareaId = workareasData?.data?.resultData?.find(
        (area: IWorkarea) => area.name === neededKey,
      )?.id;

      currentWorkareaId && getCurrentWorkarea(currentWorkareaId);
    }
  }, [location.pathname, workareasData]);
  return (
    <SidebarWrapper>
      <div>
        <SidebarHeader $isVertical={!siderIsOpen}>
          <SidebarLogo onClick={goToMainPage} $isVertical={!siderIsOpen}>
            SynthiLearn
          </SidebarLogo>
          <ButtonStyled
            $isRotate={!siderIsOpen}
            onClick={changeOpenSider}
            size={'large'}
            type={'text'}
            icon={<MenuIconStyled />}
          />
        </SidebarHeader>
        <SidebarBody
          activeAreas={activeAreas}
          deactiveAreas={deactiveAreas}
          collapsed={!siderIsOpen}
        />
      </div>
      <SidebarFooter collapsed={!siderIsOpen} />
    </SidebarWrapper>
  );
};

const SidebarWrapper = styled.div`
  background: ${COLOR_PRIMARY};
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SidebarHeader = styled.div<{ $isVertical: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  margin-bottom: 40%;

  ${({ $isVertical }) =>
    $isVertical &&
    css`
      flex-direction: column-reverse;
      gap: 56px;
      justify-content: center;
      margin-bottom: 160%;
    `}
`;

const SidebarLogo = styled.div<{ $isVertical: boolean }>`
  font-size: 22px;
  letter-spacing: 2px;
  cursor: pointer;

  transform: rotate(${props => (props.$isVertical ? '-90deg' : '0deg')});

  ${({ $isVertical }) =>
    $isVertical &&
    css`
      margin-left: -4px;
    `}
`;

const MenuIconStyled = styled(MenuFoldOutlined)`
  color: ${COLOR_TEXT};
`;

const ButtonStyled = styled(Button)<{ $isRotate: boolean }>`
  transition: all 0.3s;
  transform: rotate(${props => (props.$isRotate ? '-180deg' : '0deg')});
`;
