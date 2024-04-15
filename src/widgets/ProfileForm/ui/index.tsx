import styled from 'styled-components';
import { Button, DatePicker, Flex, Form, Input, notification } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { COLOR_PRIMARY, ENTER_FIELD, FILED_IS_REQUIRED } from 'shared/const';
import { useMutation, useQuery } from '@tanstack/react-query';
import { $api } from 'shared/api';
import { IBackendRes, IUserData } from 'shared/interfaces';
import FormItemSkeleton from 'entities/FormItemSkeleton';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { nonStrictCompareObjects } from 'shared/helpers/compareObjects';
import ChangeEmailModal from 'features/ChangeEmailModal';

export const ProfileForm = () => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const [submittable, setSubmittable] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);

  const {
    data: userData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [],
    queryFn: () => {
      return $api.get<IBackendRes<IUserData>>('customer-service/v1/customer');
    },
  });

  const { mutate: editUserData, isPending: isLoadingCreateQuestion } =
    useMutation({
      mutationFn: (payload: { name: string; surname: string }) => {
        return $api.patch<{ name: string; surname: string }>(
          'customer-service/v1/customer',
          payload,
        );
      },
      onSuccess: async () => {
        notification.success({
          message: undefined,
          description: 'Данные успешно изменены!',
        });
        await refetch();
      },
    });

  const handleEditUserData = () => {
    editUserData({ name: values.name, surname: values.surname });
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    if (
      !nonStrictCompareObjects(
        values && { name: values.name, surname: values.surname },
        userData?.data.resultData,
      )
    ) {
      form
        .validateFields({ validateOnly: true })
        .then(() => setSubmittable(true))
        .catch(() => setSubmittable(false));
    } else {
      setSubmittable(false);
    }
  }, [form, values]);

  return (
    <Flex align={'center'} gap={50}>
      <Flex vertical gap={20} justify={'flex-start'}>
        <IconWrapper>
          <UserOutlined style={{ fontSize: 120 }} />
        </IconWrapper>
        <Button onClick={handleOpenModal}>Изменить почту</Button>
        {/*<Button>Изменить пароль</Button>*/}
      </Flex>
      {isFetching ? (
        <Flex gap={25} vertical>
          {[1, 2, 3, 4].map(item => (
            <FormItemSkeleton key={item} width={'300px'} />
          ))}
        </Flex>
      ) : (
        <FormStyled
          initialValues={{
            ...userData.data.resultData,
            birthDate: dayjs(userData.data.resultData.birthDate),
          }}
          form={form}
          layout="vertical"
        >
          <Form.Item
            name={'name'}
            label={'Имя'}
            rules={[
              FILED_IS_REQUIRED,
              {
                min: 4,
                type: 'string',
                message: 'Слишком короткое имя',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={'surname'}
            label={'Фамилия'}
            rules={[
              {
                required: true,
                message: ENTER_FIELD,
              },
              {
                min: 4,
                type: 'string',
                message: 'Слишком короткая фамилия',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name={'email'} label={'Почта'}>
            <Input disabled />
          </Form.Item>
          <Form.Item name={'birthDate'} label={'Дата рождения'}>
            <DatePickerStyled disabled />
          </Form.Item>
          <Form.Item>
            <Button onClick={handleEditUserData} disabled={!submittable}>
              Сохранить изменения
            </Button>
          </Form.Item>
        </FormStyled>
      )}
      <ChangeEmailModal
        open={openModal}
        closeModal={() => setOpenModal(false)}
      />
    </Flex>
  );
};

const DatePickerStyled = styled(DatePicker)`
  width: 100%;
`;

const IconWrapper = styled(Flex)`
  border-radius: 50%;
  background: ${COLOR_PRIMARY};
  padding: 40px;
`;

const FormStyled = styled(Form)`
  width: 300px;
`;
