import axios from 'axios';

type PostNonBinaryDataProps = {
    data: any;
    uri: string;
};

export default async function postNonBinaryData({
    data,
    uri,
}: PostNonBinaryDataProps) {
    return await axios({
        data,
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        url: `${process.env.EXPO_PUBLIC_API_BASE_URI}${uri}`,
    }).then(res => {
        return res.data;
    }).catch(err => {
        const { message } = err.response.message;
        return { isError: true, message };
    });
}