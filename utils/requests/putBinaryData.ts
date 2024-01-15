import axios from 'axios';
import { useShowDialog, useShowLoader } from '../../hooks';

type PutBinaryDataProps = {
    data: any;
    uri: string;
}

export default async function putBinaryData({
    data,
    uri,
}: PutBinaryDataProps) {
    console.log('This is being hit');
    /* const { setIsLoading } = useShowLoader();
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError } = useShowDialog(); */
    return await axios({
        data,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        method: 'PUT',
        url: `http://192.168.1.215:2000/api/user-signup`,
    }).then(res => {
        const { isError, message } = res.data;
        /* setIsLoading(false);
        setIsError(isError);
        setDialogTitle(isError ? 'Error' : 'Success');
        setDialogMessage(message);
        handleDialogMessageChange(true); */
        return res.data;
    }).catch(err => {
        console.log('There was an error retrieving data', err.message);
        // setIsLoading(false);
        const { isError, message } = err.response.data;
        /* setIsError(true);
        setDialogTitle('Whoops!');
        setDialogMessage(message);
        handleDialogMessageChange(true) */
        return { isError: true, message };
    });
}