import { useQuery } from "@tanstack/react-query";
import { getData } from "../../utils/requests";
import { useUser } from "../storage-hooks";

export default function useFetchBlockedUsers() {
    const { user } = useUser();
    const { _id } = user;

    return useQuery(['fetchBlockedUsers'], async () => {
        const blockedUsers = await getData({
            uri: `get-blocked-users/${_id}`,
        }).then(res => {
            const { blockedUsers } = res;
            return blockedUsers;
        });

        return blockedUsers;
    }, {
        initialData: [],
        placeholderData: [],
        staleTime: 1000,
        refetchInterval: 1000,
        refetchIntervalInBackground: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
    });
}