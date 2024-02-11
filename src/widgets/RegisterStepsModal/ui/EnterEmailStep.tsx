import { Form, Input } from 'antd';
import styled from 'styled-components';

const EnterEmailStep = () => {
  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  return (
    <FormItem
      rules={[
        {
          required: true,
          message: 'Введите почту',
        },
        {
          validator: (_, email) => {
            if (!validateEmail(email) && !!email) {
              return Promise.reject();
            }
            return Promise.resolve();
          },
          message: 'невалидный email адрес',
        },
      ]}
      name={'email'}
      label="Введите почту"
    >
      <EmailInput />
    </FormItem>
  );
};

export default EnterEmailStep;

const FormItem = styled(Form.Item)`
  margin-bottom: 10px;
  width: 100%;
`;

const EmailInput = styled(Input)`
  width: 100%;
`;
