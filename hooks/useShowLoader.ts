import { create } from 'zustand';

type ShowLoaderStateType = {
    isLoading: boolean;
};

type ShowLoaderActionsType = {
    setIsLoading: (isLoading: boolean) => void;
};

export const useShowLoader = create<ShowLoaderStateType & ShowLoaderActionsType>()((set) => ({
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set(() => ({ isLoading })),
}));