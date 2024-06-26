import styled from 'styled-components';
import { useMemo, useState } from 'react';
import EnterEmailStep from 'widgets/RegisterStepsModal/ui/EnterEmailStep';
import { Button, Divider, Flex, Form, StepProps, Steps } from 'antd';
import {
  CodeOutlined,
  LoadingOutlined,
  MailOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import EnterUserData from 'widgets/RegisterStepsModal/ui/EnterUserData';
import { useNavigate } from 'react-router-dom';
import { useRegisterStepStore } from 'widgets/RegisterStepsModal/store/useRegisterStepStore';
import AuthFormContainer from 'entities/AuthFormContainer';
import AuthBtn from 'shared/components/AuthBtn';
import { FormStyled } from 'shared/components/StyledComponents';
import { OTPCodeInput } from 'entities/OTPCodeInput/ui';

interface IUserData {
  name: string;
  surname: string;
  birthDate: string;
  email: string;
}

export const RegisterStepsModal = () => {
  const [form] = Form.useForm();
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const step = useRegisterStepStore(state => state.step);
  const isLoading = useRegisterStepStore(state => state.isLoading);
  const sendEmail = useRegisterStepStore(state => state.sendEmail);
  const sendUserData = useRegisterStepStore(state => state.sendUserData);
  const sendCode = useRegisterStepStore(state => state.sendCode);

  const redirectToLogin = () => {
    navigate('/login');
  };

  const modalSteps = useMemo(
    () => [
      <EnterEmailStep />,
      <EnterUserData form={form} />,
      <OTPCodeInput otp={otp} setOtp={setOtp} />,
    ],
    [form, otp],
  );

  const steps = useMemo(() => {
    const initSteps: StepProps[] = [
      {
        icon: <MailOutlined />,
      },
      {
        icon: <SolutionOutlined />,
      },
      {
        icon: <CodeOutlined />,
      },
    ];

    initSteps[step].icon = <LoadingOutlined />;

    return initSteps;
  }, [step]);

  const handleClickContinue = () => {
    if (isLoading) {
      return;
    }

    if (step === 0) {
      form
        .validateFields(['email'])
        .then(({ email }) => {
          sendEmail(email);
        })
        .catch(err => console.log(err));
    } else if (step === 1) {
      form
        .validateFields([
          'name',
          'surname',
          'birthDate',
          'password',
          'confirmPassword',
        ])
        .then(({ email, confirmPassword, ...userData }) => {
          sendUserData(userData);
        })
        .catch(err => console.log(err));
    } else if (step === 2) {
      if (otp.length === 6) {
        sendCode(otp, navigate);
      }
    }
  };
  return (
    <AuthFormContainer width={500}>
      <StepModal>
        <Title>Регистрация</Title>
        <Steps style={{ marginBottom: '15px' }} current={step} items={steps} />
        <FormStyled form={form} layout="vertical">
          {modalSteps[step]}
        </FormStyled>
        <AuthBtn handleClick={handleClickContinue} isLoading={isLoading}>
          {step > 1 ? 'Отправить' : 'Далее'}
        </AuthBtn>
        {step === 0 && (
          <Flex style={{ width: '100%' }} vertical gap={15} justify={'center'}>
            <DividerStyled plain>Есть аккаунт ?</DividerStyled>
            <LoginBtn onClick={redirectToLogin} size={'large'} type="link">
              Войти
            </LoginBtn>
          </Flex>
        )}
      </StepModal>
    </AuthFormContainer>
  );
};

const StepModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 24px;
  margin-bottom: 15px;
`;

const DividerStyled = styled(Divider)`
  margin: 0 !important;
`;

const LoginBtn = styled(Button)`
  padding: 0 15px !important;
  height: min-content !important;
`;
