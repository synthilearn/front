import { Form, Input } from 'antd';
import styled from 'styled-components';
import { validateEmail } from 'shared/helpers/validateEmail';

const EnterEmailStep = () => {
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
