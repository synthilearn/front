import { jwtDecode } from 'jwt-decode';
import { Avatar, Dropdown, Flex, MenuProps } from 'antd';
import { MoreOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const UserBlock = () => {
  const getUserEmail = () => {
    return jwtDecode(localStorage.getItem('accessToken')).sub;
  };

  const items: MenuProps['items'] = [
    {
      label: <Link to={'/profile'}>Профиль</Link>,
      key: '0',
    },
  ];
  return (
    <Flex style={{ height: '40px' }} gap={8} align={'center'}>
      <Dropdown trigger={['hover']} menu={{ items }}>
        <EmailStyled>
          {getUserEmail()}
          <MoreOutlined />
        </EmailStyled>
      </Dropdown>
      <Avatar shape="square" icon={<UserOutlined />} />
    </Flex>
  );
};

const EmailStyled = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 40px;
`;
