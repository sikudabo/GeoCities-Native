import { useQuery } from "@tanstack/react-query";
import { getData } from "../../utils/requests";
import { useUser } from "../storage-hooks";

export default function useFetchAllEvents() {
    const { user } = useUser();
    const { _id } = user;

    return useQuery(['fetchAllEvents'], async () => {
        const events = await getData({
            uri: `get-all-events/${_id}`,
        }).then(res => {
            const { events } = res;
            return events;
        });

        return events;
    }, 
    {
        refetchInterval: 1000,
        staleTime: 1000,
    });
}