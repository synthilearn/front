import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { produce } from 'immer';
import { IBackendRes, IWorkarea } from 'shared/interfaces';
import { $api } from 'shared/api';
import { TPartsOfSpeech, TWord } from 'shared/types';

type TDictionarySettings = {
  showTranslates: boolean;
  partsOfSpeech: TPartsOfSpeech[];
  phraseTypes: TWord[];
  startDate: string;
  endDate: string;
  groups: ('PART_OF_SPEECH' | 'LETTER')[];
};

type TDictionaryState = {
  dictionarySettings: TDictionarySettings;
  page: number;
  size: number;
};
export const useDictionaryState = create<TDictionaryState>()(
  devtools(
    (set, get) => ({
      dictionarySettings: {} as TDictionarySettings,
      page: 1,
      size: 20,
    }),
    {
      anonymousActionType: 'useAppState action',
      name: 'useAppState',
    },
  ),
);
