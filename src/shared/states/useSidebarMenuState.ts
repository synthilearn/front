import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { produce } from 'immer';

export type TTableState = {
  refetchWorkareas: boolean;
  setRefetchWorkareas: (isRefetch: boolean) => void;
};
export const useSidebarMenuState = create<TTableState>()(
  devtools(
    set => ({
      refetchWorkareas: false,
      setRefetchWorkareas: isRefetch => {
        set(
          produce((draft: TTableState) => {
            draft.refetchWorkareas = isRefetch;
          }),
        );
      },
    }),
    {
      anonymousActionType: 'useAppState action',
      name: 'useAppState',
    },
  ),
);
