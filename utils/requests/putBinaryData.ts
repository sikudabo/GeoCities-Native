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
    await axios({
        data,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        method: 'PUT',
        url: `${process.env.EXPO_PUBLIC_API_BASE_URI}${uri}}`,
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.log('There was an error retrieving data', err.message);
        const { isSuccess, message } = err.response.data;
        setIsError(true);
        setDialogTitle('Whoops!');
        setDialogMessage(message);
        handleDialogMessageChange(true)
        return { isSuccess, message };
    });
}