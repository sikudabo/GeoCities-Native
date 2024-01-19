import { useQuery } from "@tanstack/react-query";
import { getData } from "../../utils/requests";
import { useShowDialog } from "../useShowDialog";

type UseFetchUserDataProps = {
    _id: string;
};

export function useFetchUserData({ _id }: UseFetchUserDataProps) {
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError } = useShowDialog();

    return useQuery(['fetchUser'], async () => {
        const userData = await getData({
            uri: `get-user/${_id}`,
        }).then(res => {
            const { user } = res;
            return user;
        }).catch(err => {
            console.log('There was an error fetching a user profile', err.message);
            setIsError(true);
            setDialogTitle('Uh oh!');
            setDialogMessage('There was an error retrieving that user profile.');
            handleDialogMessageChange(true);
        })

        return userData;
    }, {
        refetchInterval: 20000,
        refetchOnMount: true,
    });
}