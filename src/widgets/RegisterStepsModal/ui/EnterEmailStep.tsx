import { Form, Input } from 'antd';
import styled from 'styled-components';
import { emailValidator } from 'shared/helpers/emailValidator';

const EnterEmailStep = () => {
  return (
    <FormItem
      rules={[
        {
          required: true,
          message: 'Введите почту',
        },
        {
          validator: emailValidator,
          message: 'Невалидный email адрес',
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
