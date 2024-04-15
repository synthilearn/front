import create from 'zustand';
import {devtools} from 'zustand/middleware';
import {produce} from "immer";

export type TTableState = {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void
};
export const useAppState = create<TTableState>()(
    devtools(
        (set) => ({
            isLoading: false,
            setIsLoading: (isLoading) => {
                set(
                    produce((draft: TTableState) => {
                        draft.isLoading = isLoading
                    }
                    )
                )
            }
        }),
        {
            anonymousActionType: 'useAppState action',
            name: 'useAppState',
        }
    )
);