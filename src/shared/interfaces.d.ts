import { TTemplateStatus } from 'shared/types';

export interface IAreaItem {
  label: string;
  clickLink: string;
}

export interface IBackendRes<T> {
  code: number;
  message: string | null;
  resultData: T | null;
}

export interface IAuthLink {
  links: {
    github: string;
  };
}

export interface ILoginData {
  accessToken: string;
  refreshToken: string;
}

export interface IUserData {
  id: string;
  name: string;
  surname: string;
  birthDate: string;
  email: string;
  registrationType: 'INTERNAL' | 'EXTERNAL';
  status: 'ACTIVE' | 'EMAIL_SET';
}

export interface ITemplate {
  type: TTemplateStatus;
  name: string;
  status: TTemplateStatus;
  available: null;
  description: string;
  isFake: boolean;
}
