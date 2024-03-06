import { useQuery } from "@tanstack/react-query";
import { getData } from "../../utils/requests";

type UseFetchFollowingProps = {
    _id: string;
};

export default function useFetchFollowing({ _id }: UseFetchFollowingProps) {
    return useQuery(['fetchFollowing', _id], async () => {
        const users = await getData({
            uri: `get-following/${_id}`,
        }).then(res => {
            const { users } = res;
            return users;
        }).catch(err => {
            console.log(`There was an error fetching users that a user is following: ${err.message}`);
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