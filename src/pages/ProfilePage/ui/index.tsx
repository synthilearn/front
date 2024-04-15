import styled from 'styled-components';
import { ProfileForm } from 'widgets/ProfileForm';
import { Flex, Typography } from 'antd';
import { COLOR_PRIMARY } from 'shared/const';

const { Title } = Typography;

export const ProfilePage = () => {
  return (
    <ProfilePageWrapper>
      <FormWrapper vertical align={'center'} gap={30}>
        <Title level={3}>Профиль</Title>
        <ProfileForm />
      </FormWrapper>
    </ProfilePageWrapper>
  );
};

const ProfilePageWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const FormWrapper = styled(Flex)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 2px ${COLOR_PRIMARY} solid;
  border-radius: 10px;
  padding: 3% 5%;
`;
