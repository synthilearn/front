import { DatePicker, Form, FormInstance, Input } from 'antd';
import styled from 'styled-components';
import { FILED_IS_REQUIRED } from 'shared/const';

interface IEnterUserData {
  form: FormInstance<any>;
}

const EnterUserData = ({ form }: IEnterUserData) => {
  const passwordValidator = (pass: string, pass2: string) => {
    return pass === pass2;
  };

  const getLengthValidator = (length: number) => {
    return (_: any, value: string) => {
      if (length <= value.length) {
        return Promise.resolve();
      }
      return Promise.reject();
    };
  };
  return (
    <>
      <FormItem name={'name'} label="Введите имя">
        <FormInput />
      </FormItem>
      <FormItem name={'surname'} label="Введите фамилию">
        <FormInput />
      </FormItem>
      <FormItem name={'birthDate'} label="Введите дату рождения">
        <DatePickerStyled />
      </FormItem>
      <FormItem
        name={'password'}
        label="Введите пароль"
        rules={[
          {
            validator: getLengthValidator(8),
            message: 'Пароль должен содержать не менее 8 символов',
          },
        ]}
      >
        <FormInput type="password" />
      </FormItem>
      <FormItem
        name={'confirmPassword'}
        label="Подтвердите пароль"
        rules={[
          {
            validator: (_, passwordContinue) => {
              const password = form.getFieldValue('password');
              if (
                !passwordValidator(password, passwordContinue) &&
                !!passwordContinue
              ) {
                return Promise.reject();
              }
              return Promise.resolve();
            },
            message: 'Пароли не совпадают',
          },
          {},
        ]}
      >
        <FormInput type="password" />
      </FormItem>
    </>
  );
};

export default EnterUserData;

const FormItem = styled(Form.Item).attrs(props => ({
  rules: [...(props.rules || []), FILED_IS_REQUIRED],
}))`
  margin-bottom: 10px;
  width: 100%;
`;

const FormInput = styled(Input)`
  width: 100%;
`;

const DatePickerStyled = styled(DatePicker)`
  width: 100%;
`;
