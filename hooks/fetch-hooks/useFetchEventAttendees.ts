import { useQuery } from "@tanstack/react-query";
import { getData } from "../../utils/requests";

export default function useFetchEventAttendees(eventId: string) {
    return useQuery(['fetchEventAttendees', eventId], async () => {
        const users = await getData({
            uri: `fetch-event-attending-users/${eventId}`,
        }).then(res => {
            const { users } = res;
            return users;
        });

        return users;
    }, {
        refetchInterval: 2000,
        refetchOnMount: true,
        staleTime: 1000,
    });
}