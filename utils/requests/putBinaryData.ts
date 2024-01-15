import axios from 'axios';
import { useShowDialog } from '../../hooks';

type PutBinaryDataProps = {
    data: any;
    uri: string;
}

export default async function putBinaryData({
    data,
    uri,
}: PutBinaryDataProps) {
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError } = useShowDialog();
    return await axios({
        data,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        method: 'PUT',
        url: `${process.env.EXPO_PUBLIC_API_BASE_URI}${uri}}`,
    }).then(res => {
        const { isError, message } = res.data;
        setIsError(isError);
        setDialogTitle(isError ? 'Error' : 'Success');
        setDialogMessage(message);
        handleDialogMessageChange(true);
        return res.data;
    }).catch(err => {
        console.log('There was an error retrieving data', err.message);
        const { isError, message } = err.response.data;
        setIsError(true);
        setDialogTitle('Whoops!');
        setDialogMessage(message);
        handleDialogMessageChange(true)
        return { isError, message };
    });
}