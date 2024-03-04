import { useQuery } from "@tanstack/react-query";
import { getData } from "../../utils/requests";
import { GroupType, UserType } from "../../typings";

export default function useFetchGroup(groupName: string) {
    return useQuery(['fetchGroup'], async () => {
        const groupData: { blockedUsers: Array<UserType>; group: any } = await getData({
            uri: `get-group/${groupName}`,
        }).then(res => {
            const { blockedUsers, group } = res;
            return {
                blockedUsers,
                group,
            }
        });

        return groupData;
    }, {
        refetchIntervalInBackground: true,
        refetchInterval: 1000,
        refetchOnMount: true,
        staleTime: 1000,
    });
}