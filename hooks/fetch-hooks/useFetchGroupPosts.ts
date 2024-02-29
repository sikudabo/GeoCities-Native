import { useQuery } from "@tanstack/react-query";
import { getData } from "../../utils/requests";

export default function useFetchGroupPosts(groupName: string) {
    return useQuery(['fetchGroupPosts'], async () => {
        const posts = await getData({
            uri: `fetch-group-posts/${groupName}`,
        }).then(res => {
            const { posts } = res;
            return posts;
        }).catch(err => {
            console.log(`There was an error fetching group posts: ${err.message}`);
        });

        return posts;
    }, {
        refetchInterval: 1000,
        refetchOnMount: true,
        staleTime: 1000,
    });
}