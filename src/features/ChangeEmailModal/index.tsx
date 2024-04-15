import { Button, Form, Input, Modal, StepProps, Steps } from 'antd';
import { useMemo, useState } from 'react';
import { CodeOutlined, LoadingOutlined, MailOutlined } from '@ant-design/icons';
import { FormStyled } from 'shared/components/StyledComponents';
import { OTPCodeInput } from 'entities/OTPCodeInput/ui';
import { COLOR_SECONDARY, FILED_IS_REQUIRED } from 'shared/const';
import { emailValidator } from 'shared/helpers/emailValidator';
import styled from 'styled-components';

interface IProps {
  open: boolean;
  closeModal: () => void;
}

const ChangeEmailModal = ({ open, closeModal }: IProps) => {
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [form] = Form.useForm();

  const steps = useMemo(() => {
    const initSteps: StepProps[] = [
      {
        icon: <MailOutlined />,
      },
      {
        icon: <CodeOutlined />,
      },
    ];

    initSteps[step].icon = (
      <LoadingOutlined style={{ color: COLOR_SECONDARY }} />
    );

    return initSteps;
  }, [step]);

  const handleChangeStep = () => {
    if (step === 0) {
      form
        .validateFields()
        .then(() => {
          //тут отправка новой почты
          setStep(1);
        })
        .catch(() => {});
    } else if (step === 1) {
      // тут отправка отп кода
    }
  };
  return (
    <ModalStyled
      open={open}
      onCancel={closeModal}
      title={'Изменение почты'}
      centered
      destroyOnClose
      footer={[
        <Button onClick={handleChangeStep}>
          {step === 0 ? 'Далее' : 'Измениь почту'}
        </Button>,
      ]}
    >
      <Steps style={{ marginBottom: '15px' }} current={step} items={steps} />
      {step === 0 ? (
        <FormStyled form={form} layout="vertical">
          <Form.Item
            name={'email'}
            label={'Введите почту'}
            rules={[
              {
                validator: emailValidator,
                message: 'Невалидный email адрес',
              },
              FILED_IS_REQUIRED,
            ]}
          >
            <Input />
          </Form.Item>
        </FormStyled>
      ) : (
        <OTPCodeInput otp={otp} setOtp={setOtp} />
      )}
    </ModalStyled>
  );
};

export default ChangeEmailModal;

const ModalStyled = styled(Modal)`
  & .ant-modal-body {
    padding: 20px 0 10px;
  }
`;
