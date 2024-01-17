import axios from 'axios';

export type PutBinaryDataProps = {
    data: any;
    uri: string;
}

export default async function putBinaryData({
    data,
    uri,
}: PutBinaryDataProps) {
    return await axios({
        data,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        method: 'PUT',
        url: `${process.env.EXPO_PUBLIC_API_BASE_URI}${uri}`,
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.log('There was an error retrieving data', err.message);
        const { message } = err.response.data;
        return { isError: true, message };
    });
}