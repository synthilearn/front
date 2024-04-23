import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { produce } from 'immer';
import { IBackendRes, IWorkarea } from 'shared/interfaces';
import { $api } from 'shared/api';

export type TCurrentWorkareaState = {
  currentWorkarea: IWorkarea | undefined;
  getCurrentWorkarea: (workareaId: string) => void;
};
export const useCurrentWorkarea = create<TCurrentWorkareaState>()(
  devtools(
    (set, get) => ({
      currentWorkarea: undefined,
      getCurrentWorkarea: async workareaId => {
        const currentWorkarea = await $api.get<IBackendRes<IWorkarea>>(
          `/workarea-service/v1/workarea/${workareaId}`,
        );

        set({ currentWorkarea: currentWorkarea.data.resultData });
      },
    }),
    {
      anonymousActionType: 'useAppState action',
      name: 'useAppState',
    },
  ),
);
