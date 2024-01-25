import { useQuery } from "@tanstack/react-query";
import { getData } from "../../utils/requests";
import { useUser } from "../storage-hooks";

export default function useFetchFeedPosts() {
    const { user } = useUser();
    const { _id } = user;

    return useQuery(['fetchFeedPosts'], async () => {
        const posts = await getData({
            uri: `get-feed-posts/${_id}`,
        }).then(res => {
            const { posts } = res
            return posts;
        }).catch(err => {
            console.log(`There was an error catching feed posts:', ${err.message}`);
            return { isError: true, message: 'There was an error returning feed posts.' };
        });

        return posts;
    }, {
        refetchInterval: 60000,
        refetchIntervalInBackground: true,
        refetchOnMount: true,
        staleTime: 60000,
    });
}