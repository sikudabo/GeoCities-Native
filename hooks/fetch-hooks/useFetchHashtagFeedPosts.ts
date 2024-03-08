import { useQuery } from "@tanstack/react-query";
import { getData } from "../../utils/requests";
import { useUser } from "../storage-hooks";

export default function useFetchHashtagFeedPosts(hashtag: string) {
    const { user } = useUser();
    const { _id } = user;
    return useQuery(['fetchHashtagFeedPosts', _id, hashtag], async () => {
        const posts = await getData({
            uri: `get-hashtag-posts/${_id}/${hashtag}`,
        }).then(res => {
            const { posts } = res;
            return posts;
        });
        return posts;
    }, {
        refetchInterval: 2000,
        refetchOnMount: true,
        staleTime: 1000,
    });
}