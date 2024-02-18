import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { IUserData } from 'shared/interfaces';
import { notification } from 'antd';
import { $api } from 'shared/api';
import { produce } from 'immer';

interface IUserWIthoutEmail extends Omit<IUserData, 'email'> {
  password: string;
}

type TRegisterSteps = {
  userData: {
    email: string;
    name: string;
    surname: string;
    birthDate: string;
  };
  step: number;
  isLoading: boolean;
  goNextStep: () => void;
  goLastStep: () => void;
  showNotifError: (textError: string) => void;
  sendEmail: (email: string) => void;
  setupEmail: (email: string) => void;
  sendUserData: (userData: IUserWIthoutEmail) => void;
  sendCode: (code: string, navigate: (to: string) => void) => void;
  goInitState: () => void;
};

const initState = {
  userData: {
    name: '',
    surname: '',
    birthDate: '',
    email: '',
  },
  step: 0,
  isLoading: false,
};
export const useRegisterStepStore = create<TRegisterSteps>()(
  devtools(
    (set, get) => ({
      ...initState,
      goNextStep: () => set({ step: get().step + 1 }),
      goLastStep: () => set({ step: 2 }),
      showNotifError: textError => {
        notification.error({
          message: 'Ошибка!',
          description: textError,
        });
      },
      sendEmail: async email => {
        set({ isLoading: true });

        await $api
          .get(`customer-service/v1/customer/by-email/${email}`)
          .then(async res => {
            if (res.data.resultData.status === 'ACTIVE') {
              get().showNotifError(`Аккаунт с почтой ${email} уже существует`);
            } else if (res.data.resultData.status === 'DATA_SAVED') {
              set(
                produce(draft => {
                  draft.userData.email = email;
                }),
              );
              get().goLastStep();
            } else {
              await get().setupEmail(email);
            }
          })
          .catch(async err => {
            if (err.response.data.message.includes('not found')) {
              await get().setupEmail(email);
            }
          });
        set({ isLoading: false });
      },
      setupEmail: async email => {
        await $api
          .post('customer-service/v1/auth/email-setup', {
            email,
          })
          .then(() => {
            get().goNextStep();
          })
          .catch(err => {
            if (err?.response.data.message.includes('Customer with email')) {
              get().goNextStep();
            } else {
              get().showNotifError('Возникла непредвиденнаяя ошибка');
            }
          })
          .finally(() => {
            set(
              produce(draft => {
                draft.userData.email = email;
              }),
            );
          });
      },
      sendUserData: async ({ name, surname, birthDate, password }) => {
        set({ isLoading: true });
        await $api
          .post(
            '/entrypoint-service/v1/auth/data-save',
            {
              name,
              surname,
              birthDate,
              email: get().userData.email,
            },
            {
              headers: {
                secretPair: btoa(`${get().userData.email}:${password}`),
              },
            },
          )
          .then(() => {
            get().goNextStep();
            set({ isLoading: false });
          });
      },
      sendCode: async (OTPcode, navigate) => {
        set({ isLoading: true });
        await $api
          .post('/entrypoint-service/v1/auth/activate', {
            email: get().userData.email,
            otpCode: OTPcode,
          })
          .then(res => {
            notification.success({
              message: 'Регистрация выполнена',
              description: `${res.data.resultData.name}, вы успешно зарегистрировались!`,
            });
            navigate('/login');
          })
          .catch(err => {
            if (err?.response.data.message.includes("Otp code didn't match")) {
              get().showNotifError('Неверный код подтверждения');
            }
          });

        set({ isLoading: false });
      },
      goInitState: () => {
        set({ ...initState });
      },
    }),
    {
      anonymousActionType: 'useEditDataState action',
      name: 'useRegisterStepStore',
    },
  ),
);
