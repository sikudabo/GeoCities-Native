import { useQuery } from '@tanstack/react-query';
import { getData } from '../../utils/requests';

type UseFetchUserProfilePostsProps = {
    _id: string;
};

export default function useFetchUserProfilePosts({ _id }: UseFetchUserProfilePostsProps) {
    return useQuery(['fetchProfilePosts'], async () => {
        const posts = await getData({
            uri: `get-profile-posts/${_id}`,
        }).then(res => {
            const { posts } = res;
            return posts;
        }).catch(err => {
            const { message } = err.response.data;
            return { isError: true, message };
        });

        return posts;
    }, {
        refetchInterval: 600000,
        refetchOnMount: true,
    });
}