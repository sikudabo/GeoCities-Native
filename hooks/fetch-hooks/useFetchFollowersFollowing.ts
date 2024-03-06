import { useQuery } from "@tanstack/react-query";
import { getData } from "../../utils/requests";

type UseFetchFollowersFollowingProps = {
    _id: string;
    isFollowing: boolean;
};

export default function useFetchFollowersFollowing({ _id, isFollowing }: UseFetchFollowersFollowingProps) {
    return useQuery(['fetchFollowersFollowing'], async () => {
        const users = await getData({
            uri: `get-followers-following/${_id}/${isFollowing}`,
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