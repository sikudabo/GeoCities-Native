import create from 'zustand';
import { persist } from 'zustand/middleware';
import { UserType } from '../../typings';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = UserType & {
    isLoggedIn: boolean;
};

type UserStateType = {
    user: User | {} | any;
};

type UserActionsType = {
    clearUser: () => void;
    setUser: (user: User) => void;
};


export const useUser = create(
    persist<UserStateType & UserActionsType>(
      (set) => ({
        user: {},
        clearUser: () => set(() => ({ user: {} })),
        setUser: (user: User ) => set(() => ({ user })),
      }),
      {
        getStorage: () => AsyncStorage,
        name: 'user-data-storage',
      },
    ),
  );