import { useQuery } from "@tanstack/react-query";
import { getData } from "../../utils/requests";

export default function useFetchGroup(_id: string) {
    return useQuery(['fetchGroup'], async () => {
        const group = await getData({
            uri: `get-group/${_id}`,
        }).then(res => {
            const { group } = res;
            return group;
        }).catch(err => {
            console.log(`There was an error fetching a group: ${err.message}`);
            return {
                isError: true,
                message: 'There was an error fetching a group',
            };
        });

        return group;
    }, {
        refetchIntervalInBackground: true,
        refetchInterval: 1000,
        refetchOnMount: true,
        staleTime: 1000,
    });
}