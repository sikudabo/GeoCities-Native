import { create } from 'zustand';

type DrawerStateType = {
    isDrawerOpen: boolean;
};

type DrawerActionsType = {
    setDrawerOpen: (isDrawerOpen: boolean) => void;
};

export const useDrawerState = create<DrawerActionsType & DrawerStateType>()((set) => ({
    isDrawerOpen: false,
    setDrawerOpen: (isDrawerOpen: boolean) => set(() => ({ isDrawerOpen })),
}));