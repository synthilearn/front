export type TIRole = 'ROLE_MANAGER' | 'ROLE_CLIENT';

export interface IToken {
  role: TIRole;
  sub: string;
  company?: string;
}

export interface IAreaItem {
  label: string;
  clickLink: string;
}

export interface IBackendRes<T> {
  code: number;
  message: string | null;
  resultData: T | null;
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
