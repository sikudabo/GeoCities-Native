import axios from 'axios';

export type PostBinaryDataProps = {
    data: any;
    uri: string;
}

export default async function postBinaryData({
    data,
    uri,
}: PostBinaryDataProps) {
    return await axios({
        data,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        method: 'POST',
        url: `${process.env.EXPO_PUBLIC_API_BASE_URI}${uri}`,
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.log('There was an error retrieving data', err.message);
        const { message } = err.response.data;
        return { isError: true, message };
    });
}