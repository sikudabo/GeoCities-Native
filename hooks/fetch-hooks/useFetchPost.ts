import { useQuery } from '@tanstack/react-query';
import { getData } from '../../utils/requests';

type UseFetchPostType = {
    _id: string;
};

export default function useFetchPost({ _id }: UseFetchPostType) {
    return useQuery(['fetchPost'], async () => {
        const data = await getData({
            uri: `get-post/${_id}`,
        }).then(res => {
            return res;
        }).catch(err => {
            console.log(`There was an error fetching a post: ${err.message}`);
            return { isError: true, message: 'There was an error fetching this post.' };
        });

        return data;
    }, {
        refetchInterval: 60000,
        refetchOnMount: true,
    });
}