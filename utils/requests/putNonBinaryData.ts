import axios from 'axios';
import { PutBinaryDataProps } from './putBinaryData';

export default async function putNonBinaryData({
    data,
    uri,
}: PutBinaryDataProps) {
    return await axios({
        data,
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'PUT',
        url: `${process.env.EXPO_PUBLIC_API_BASE_URI}${uri}`,
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.log('There was an error with a put request:', err.message);
        const { message } = err.response.data;
        return { isError: true, message };
    });
}