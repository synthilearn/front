import {
  TPartsOfSpeech,
  TTemplateStatus,
  TWord,
  TWorkareaStatus,
} from 'shared/types';

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

export interface IWorkarea {
  id: string;
  name: string;
  status: TWorkareaStatus;
  type: string;
  widgets: IWorkareaWidget[];
  workspaceId: string;
}

export interface IWorkareaWidget {
  id: string;
  name: string;
  type: string;
}

export interface ITemplate {
  type: string;
  name: string;
  status: TTemplateStatus;
  available: null;
  description: string;
  isFake: boolean;
}

export interface IWord {
  id: string;
  dictionaryId: string;
  text: string;
  type: TWord;
  phraseTranslates: ITranslation[] | null;
}

export interface ITranslation {
  partOfSpeech: TPartsOfSpeech;
  translationText: string;
}
