import { jwtDecode } from 'jwt-decode';
import { Avatar, Dropdown, Flex, MenuProps } from 'antd';
import { MoreOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useTourState } from 'shared/states/useTourState';

export const UserBlock = () => {
  const userBlockRef = useRef();
  const getUserEmail = () => {
    return jwtDecode(localStorage.getItem('accessToken')).sub;
  };

  const setTargetTourItem = useTourState(state => state.setTargetTourItem);

  const items: MenuProps['items'] = [
    {
      label: <Link to={'/profile'}>Профиль</Link>,
      key: '0',
    },
  ];

  useEffect(() => {
    console.log(userBlockRef.current);
    setTargetTourItem(3, userBlockRef.current);
  }, [userBlockRef.current]);
  return (
    <div ref={userBlockRef}>
      <Flex style={{ height: '40px' }} gap={8} align={'center'}>
        <Dropdown trigger={['hover']} menu={{ items }}>
          <EmailStyled>
            {getUserEmail()}
            <MoreOutlined />
          </EmailStyled>
        </Dropdown>
        <Avatar shape="square" icon={<UserOutlined />} />
      </Flex>
    </div>
  );
};

const EmailStyled = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 40px;
`;
