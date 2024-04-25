import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { produce } from 'immer';
import { IBackendRes, IWorkarea } from 'shared/interfaces';
import { $api } from 'shared/api';
import { TPartsOfSpeech, TWord } from 'shared/types';

type TDictionarySettings = {
  showTranslation: boolean;
  partsOfSpeech: TPartsOfSpeech[];
  phraseTypes: TWord[];
  dateFrom: string;
  dateTo: string;
  groups: ('PART_OF_SPEECH' | 'LETTER')[];
};

type TDictionaryState = {
  dictionarySettings: TDictionarySettings;
  page: number;
  size: number;
  setDictionarySettings: (settings: TDictionarySettings) => void;
  getDictionarySettings: (dictionaryId: string) => void;
};
export const useDictionaryState = create<TDictionaryState>()(
  devtools(
    (set, get) => ({
      dictionarySettings: null as TDictionarySettings,
      page: 1,
      size: 20,
      setDictionarySettings: settings => {
        set({ dictionarySettings: settings });
      },
      getDictionarySettings: async dictionaryId => {
        const res = await $api.get<IBackendRes<any>>(
          `dictionary-service/v1/dictionary-parameters/${dictionaryId}`,
        );
        set({ dictionarySettings: res.data.resultData });
      },
    }),
    {
      anonymousActionType: 'useAppState action',
      name: 'useAppState',
    },
  ),
);
