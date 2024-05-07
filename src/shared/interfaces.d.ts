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
  available: null | 'USED';
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

export interface IWordsData {
  totalPages: number;
  phrases: any;
}

export interface IWordTemplate {
  id: string;
  amountWords: number;
  creationDate: string;
  file: string;
  name: string;
}

export interface IGameParameters {
  dictionaryId: string;
  partsOfSpeech: TPartsOfSpeech[];
  phraseTypes: TWord[];
  translatesAmount: number;
  typeOfGame: 'DEFAULT';
  timeOnWord: number;
}

export interface IGameData {
  id: string;
  creationDate: string;
  result: null | any;
  statisticCreated: boolean;
  status: 'IN_PROGRESS' | 'FINISHED';
}

export interface IGame {
  currentPhrase: string | null;
  currentStage: number | null;
  allStages: number | null;
  stageEndTime: string | null;
  gameStartedTime: string | null;
  answerOptions: string[];
  isStarted: boolean | null;
  isFinished: boolean | null;
}
