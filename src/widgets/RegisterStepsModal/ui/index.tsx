import styled from 'styled-components';
import { useMemo, useState } from 'react';
import EnterEmailStep from 'widgets/RegisterStepsModal/ui/EnterEmailStep';
import { Form, Spin, StepProps, Steps } from 'antd';
import {
  CodeOutlined,
  LoadingOutlined,
  MailOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import EnterUserData from 'widgets/RegisterStepsModal/ui/EnterUserData';
import EnterCode from 'widgets/RegisterStepsModal/ui/EnterCode';
import { useNavigate } from 'react-router-dom';
import { useRegisterStepStore } from 'widgets/RegisterStepsModal/store/useRegisterStepStore';

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

  const modalSteps = useMemo(
    () => [
      <EnterEmailStep />,
      <EnterUserData form={form} />,
      <EnterCode otp={otp} setOtp={setOtp} />,
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
    <StepsModalContainer>
      <Title>Регистрация</Title>
      <Steps style={{ marginBottom: '15px' }} current={step} items={steps} />
      <FormStyled form={form} layout="vertical">
        {modalSteps[step]}
      </FormStyled>
      <StyledButton onClick={handleClickContinue}>
        {isLoading ? <SpinStyled /> : step > 1 ? 'Отправить' : 'Далее'}
      </StyledButton>
    </StepsModalContainer>
  );
};

const StepsModalContainer = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 25px;
  justify-content: center;
  align-items: center;
  padding: 40px;
  border-radius: 4px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 9);
  width: 500px;
  background: #3d3d3d;
  font-size: 20px;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 24px;
  margin-bottom: 15px;
`;

const FormStyled = styled(Form)`
  width: 100%;
`;

const StyledButton = styled.span`
  line-height: 50px;
  height: 50px;
  text-align: center;
  width: 250px;
  cursor: pointer;
  color: #fff;
  transition: all 0.5s;
  position: relative;
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(255, 255, 255, 0.1);
    transition: all 0.3s;
  }

  &:hover::before {
    opacity: 0;
    transform: scale(0.5, 0.5);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0;
    transition: all 0.3s;
    border: 1px solid rgba(255, 255, 255, 0.5);
    transform: scale(1.2, 1.2);
  }

  &:hover::after {
    opacity: 1;
    transform: scale(1, 1);
  }
`;

const SpinStyled = styled(Spin)`
  & .ant-spin-dot-item {
    background-color: white;
  }
`;
