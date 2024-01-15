import axios from 'axios';

type PutBinaryDataProps = {
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
        url: `http://192.168.1.215:2000/api/user-signup`,
    }).then(res => {
        return res.data;
    }).catch(err => {
        console.log('There was an error retrieving data', err.message);
        const { message } = err.response.data;
        return { isError: true, message };
    });
}