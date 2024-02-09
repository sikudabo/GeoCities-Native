import { useQuery } from "@tanstack/react-query";
import { getData } from "../../utils/requests";
import { useShowDialog } from "../useShowDialog";

export default function useFetchUserGroups(_id: string) {
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError } = useShowDialog();

    return useQuery(['fetchUserGroups'], async () => {
        const groups = await getData({
            uri: `get-groups/${_id}`,
        }).then(res => {
            const { groups } = res;
            return groups;
        }).catch(err => {
            console.log(`There was an error fetching this users' groups: ${err.message}`);
            setIsError(true);
            setDialogTitle('Uh oh!');
            setDialogMessage('There was an error fetching the groups for this profile.');
            handleDialogMessageChange(true);
        });

        return groups;
    }, {
        refetchOnMount: true,
    });
}