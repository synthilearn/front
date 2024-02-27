import AuthFormContainer from 'entities/AuthFormContainer';
import styled from 'styled-components';
import { Button, Divider, Flex, Form, Input, notification, Spin } from 'antd';
import { validateEmail } from 'shared/helpers/validateEmail';
import AuthBtn from 'shared/components/AuthBtn';
import { GithubOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { $api } from 'shared/api';
import { IAuthLink, IBackendRes, ILoginData } from 'shared/interfaces';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const LoginModal = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { mutate: getGithubLink, isPending: isLoadingGithub } = useMutation({
    mutationFn: () => {
      return $api.get<IBackendRes<IAuthLink>>(
        '/entrypoint-service/v1/oauth2/github/auth-link',
      );
    },
    onSuccess: ({ data: { resultData } }) => {
      window.location.replace(resultData.links.github);
    },
    onError: err => {},
    onSettled: () => {},
  });

  const { mutate: login, isPending: isLoadingLogin } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return $api.post<IBackendRes<ILoginData>>(
        '/entrypoint-service/v1/auth/login',
        {},
        {
          headers: {
            secretPair: btoa(`${email}:${password}`),
            platform: navigator.userAgent,
          },
        },
      );
    },
    onSuccess: ({ data: { resultData } }) => {
      localStorage.setItem('accessToken', resultData.accessToken);
      localStorage.setItem('refreshToken', resultData.refreshToken);

      window.location.reload();

      notification.success({
        message: 'Вход выполнен!',
        description: 'Вы успешно вошли в аккаунт',
      });
    },
    onError: (err: AxiosError<IBackendRes<ILoginData>>) => {
      if (err.response?.data?.message.includes("Passwords don't match")) {
        notification.error({
          message: 'Ошибка!',
          description: 'Неверная почта или пароль',
        });
        return;
      }
      notification.error({
        message: 'Ошибка!',
        description: 'Не удалось выполнить вход',
      });
    },
  });

  const handleLogin = () => {
    form
      .validateFields()
      .then(values => {
        login(values);
      })
      .catch(err => console.log(err));
  };

  const redirectToRegister = () => {
    navigate('/register');
  };

  const loginUsingGitHub = () => {
    getGithubLink();
  };
  return (
    <AuthFormContainer width={450}>
      <Title>Вход</Title>
      <FormStyled form={form} layout="vertical">
        <FormItem
          label="Введите почту"
          name="email"
          rules={[
            {
              required: true,
              message: 'Заполните поле',
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
        >
          <Input />
        </FormItem>
        <FormItem
          label="Введите пароль"
          name="password"
          rules={[
            {
              required: true,
              message: 'Заполните поле',
            },
          ]}
        >
          <Input type={'password'} />
        </FormItem>
        <AuthBtn isLoading={isLoadingLogin} handleClick={handleLogin}>
          Войти
        </AuthBtn>
      </FormStyled>
      <Flex gap={'middle'} vertical align={'center'}>
        <DividerStyled plain>Нет аккаунта ?</DividerStyled>
        <RegisterBtn onClick={redirectToRegister} size={'large'} type="link">
          Зарегистрироваться
        </RegisterBtn>
        <GithubButton
          onClick={loginUsingGitHub}
          size={'large'}
          icon={isLoadingGithub ? <Spin /> : <GithubOutlined />}
        >
          Войти через
        </GithubButton>
      </Flex>
    </AuthFormContainer>
  );
};

const Title = styled.div`
  font-weight: 500;
  font-size: 24px;
  margin-bottom: 15px;
  text-align: center;
`;

const FormStyled = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 30px;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

const FormItem = styled(Form.Item).attrs(props => ({
  validateTrigger: ['onBlur'],
}))`
  width: 100%;
  margin-bottom: 0;
`;

const DividerStyled = styled(Divider)`
  margin: 0 !important;
`;

const RegisterBtn = styled(Button)`
  padding: 0 15px !important;
  height: min-content !important;
`;

const GithubButton = styled(Button)`
  display: flex;
  align-items: center;
  flex-flow: row-reverse;

  & .ant-btn-icon {
    margin-inline-end: 0;
    margin-inline-start: 8px;
  }
`;

const BtnsWrapper = styled.div`
  display: flex;
`;
