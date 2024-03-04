import { useQuery } from "@tanstack/react-query";
import { getData } from "../../utils/requests";
import { GroupType } from "../../typings";

export default function useFetchAllGroups() {
    return useQuery(['fetchAllGroups'], async () => {
        const groups: Array<GroupType> = await getData({
            uri: 'get-all-groups',
        }).then(res => {
            const { groups } = res;
            return groups;
        }).catch(err => {
            console.log('Error fetching all of the groups:', err.message);
            return {
                isError: true,
            }
        });

        return groups;
    }, {
        refetchInterval: 5000,
        refetchOnMount: true,
        staleTime: 30000
    });
}