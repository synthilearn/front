import { validateEmail } from 'shared/helpers/validateEmail';

export const emailValidator = (_: any, email: string) => {
  if (!validateEmail(email) && !!email) {
    return Promise.reject();
  }
  return Promise.resolve();
};
