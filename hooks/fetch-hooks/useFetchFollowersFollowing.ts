import { useQuery } from "@tanstack/react-query";
import { getData } from "../../utils/requests";

type UseFetchFollowersFollowingProps = {
    _id: string;
    isFollowers: boolean;
};

export default function useFetchFollowersFollowing({ _id, isFollowers }: UseFetchFollowersFollowingProps) {
    return useQuery(['fetchFollowersFollowing'], async () => {
        const users = await getData({
            uri: `get-followers-following/${_id}/${isFollowers}`,
        }).then(res => {
            const { users } = res;
            return users;
        });

        return users;
    }, {
        refetchInterval: 1000,
        refetchOnMount: true,
        staleTime: 1000,
    });
}