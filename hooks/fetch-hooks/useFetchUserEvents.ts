import { useQuery } from "@tanstack/react-query";
import { getData } from "../../utils/requests";

export default function useFetchUserEvents(_id: string) {
    return useQuery(['fetchUserEvents', _id], async () => {
        const events = await getData({
            uri: `get-user-events/${_id}`,
        }).then(res => {
            const { events } = res;
            return events;
        });

        return events;
    }, {
        refetchInterval: 2000,
        refetchOnMount: true,
        staleTime: 1000,
    });
}