export type TIRole = 'ROLE_MANAGER' | 'ROLE_CLIENT';

export interface IToken {
  role: TIRole;
  sub: string;
  company?: string;
}
