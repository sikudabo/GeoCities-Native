import { create } from 'zustand';

type ShowDialogStateType = {
    isOpen: boolean;
    isError: boolean;
    message:string;
    title: string;
};

type ShowDialogActionsType = {
    handleDialogMessageChange: (isOpen: boolean) => void;
    setIsError: (isError: boolean) => void;
    setDialogMessage: (message: string) => void;
    setDialogTitle: (title: string) => void;
};

export const useShowDialog = create<ShowDialogStateType & ShowDialogActionsType>((set) => ({
    isOpen: false,
    isError: false,
    message: "",
    title: "",
    handleDialogMessageChange: (isOpen: boolean) => set({ isOpen }),
    setIsError: (isError: boolean) => set({ isError }),
    setDialogMessage: (message: string) => set({ message }),
    setDialogTitle: (title: string) => set({ title }),
}));