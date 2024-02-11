import styled from 'styled-components';
import { useMemo, useState } from 'react';
import EnterEmailStep from 'widgets/RegisterStepsModal/ui/EnterEmailStep';
import { Form, notification, Spin, StepProps, Steps } from 'antd';
import {
  CodeOutlined,
  LoadingOutlined,
  MailOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import EnterUserData from 'widgets/RegisterStepsModal/ui/EnterUserData';
import EnterCode from 'widgets/RegisterStepsModal/ui/EnterCode';
import { $api } from 'shared/api';
import { useNavigate } from 'react-router-dom';

interface IUserData {
  name: string;
  surname: string;
  birthDate: string;
  email: string;
}

export const RegisterStepsModal = () => {
  const [form] = Form.useForm();
  const [userData, setUserData] = useState<IUserData>({
    name: '',
    surname: '',
    birthDate: '',
    email: '',
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(0);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const navigate = useNavigate();

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

  const setEmail = (email: string) => {
    setUserData(prev => ({ ...prev, email }));
  };

  const setNextStep = () => {
    setStep(prev => prev + 1);
  };

  const setupEmail = async (email: string) => {
    await $api
      .post('customer-service/v1/auth/email-setup', {
        email,
      })
      .then(() => {
        setNextStep();
      })
      .catch(err => {
        if (err?.response.data.message.includes('Customer with email')) {
          setNextStep();
        } else {
          notification.error({
            message: 'Ошибка!',
            description: 'Возникла непредвиденнаяя ошибка',
          });
        }
      })
      .finally(() => {
        setEmail(email);
        setIsLoadingBtn(false);
      });
  };

  const sendEmail = async () => {
    await form
      .validateFields(['email'])
      .then(({ email }) => {
        setIsLoadingBtn(true);
        $api
          .get(`customer-service/v1/customer/by-email/${email}`)
          .then(async res => {
            if (res.data.resultData.status === 'ACTIVE') {
              notification.error({
                message: 'Ошибка!',
                description: `Аккаунт с почтой ${email} уже существует`,
              });
              setIsLoadingBtn(false);
            } else if (res.data.resultData.status === 'DATA_SAVED') {
              setEmail(email);
              setStep(2);
              setIsLoadingBtn(false);
            } else {
              await setupEmail(email);
            }
          })
          .catch(async err => {
            if (err.response.data.message.includes('not found')) {
              await setupEmail(email);
            }
          });
      })
      .catch(err => console.log(err));
  };

  const sendUserData = () => {
    form
      .validateFields([
        'name',
        'surname',
        'birthDate',
        'password',
        'confirmPassword',
      ])
      .then(({ name, surname, birthDate, password }) => {
        $api
          .post(
            '/entrypoint-service/v1/auth/data-save',
            {
              name,
              surname,
              birthDate,
              email: userData.email,
            },
            {
              headers: {
                secretPair: btoa(`${userData.email}:${password}`),
              },
            },
          )
          .then(() => {
            setNextStep();
          });
      })
      .catch(err => console.log(err));
  };

  const sendCode = () => {
    console.log(otp);
    if (otp.length === 6) {
      $api
        .post('/entrypoint-service/v1/auth/activate', {
          email: userData.email,
          otpCode: otp,
        })
        .then(res => {
          notification.success({
            message: 'Вход выполнен!',
            description: `${res.data.resultData.name}, вы успешно вошли в систему`,
          });
          navigate('/');
        })
        .catch(err => {
          if (err.data.message.includes("Otp code didn't match")) {
            notification.error({
              message: 'Ошибка!',
              description: 'Неверный код подтверждения',
            });
          }
        });
    }
  };

  const handleClickContinue = () => {
    if (step === 0) {
      sendEmail();
    } else if (step === 1) {
      sendUserData();
    } else if (step === 2) {
      sendCode();
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
        {step > 1 ? 'Отправить' : 'Далее'} {isLoadingBtn && <SpinStyled />}
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
  position: absolute;
  top: 50%;
  right: 20%;
  transform: translate(-50%, -50%);
`;
