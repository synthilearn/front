import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { produce } from 'immer';

export type TAppState = {
    isAuthUser: boolean;
    setIsAuth: () => void;
};
export const useAppState = create<TAppState>()(
    devtools(
        (set, get) => ({
            isAuthUser: !!localStorage.getItem('accessToken'),
            setIsAuth: () => {
                set(
                    produce((draft: TAppState) => {
                        draft.isAuthUser = !get().isAuthUser;
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