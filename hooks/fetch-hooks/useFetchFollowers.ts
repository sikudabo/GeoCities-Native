import { useQuery } from "@tanstack/react-query";
import { getData } from "../../utils/requests";

type UseFetchFollowersProps = {
    _id: string;
};

export default function useFetchFollowers({ _id }: UseFetchFollowersProps) {
    return useQuery(['fetchFollowers', _id], async () => {
        const users = await getData({
            uri: `get-followers/${_id}`,
        }).then(res => {
            const { users } = res;
            return users;
        }).catch(err => {
            console.log(`There was an error fetching users that are following a user: ${err.message}`);
        })

        return users;
    }, {
        placeholderData: [],
        refetchOnReconnect: true,
        refetchInterval: 1000,
        refetchOnMount: true,
        staleTime: 1000,
    });
}