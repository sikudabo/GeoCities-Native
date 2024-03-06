import { useQuery } from "@tanstack/react-query";
import { getData } from "../../utils/requests";
import { UserType } from "../../typings";

export default function useFetchAllUsers() {
    return useQuery(['fetchAllUsers'], async () => {
        const users: Array<UserType> = await getData({
            uri: 'get-all-users',
        }).then(res => {
            const { users } = res;
            return users;
        }).catch(err => {
            console.log('Error fetching all of the users from the DB:', err.message);
            return {
                isError: true,
            }
        });

        return users;
    }, {
        refetchInterval: 5000,
        refetchOnMount: true,
        staleTime: 30000,
    });
}