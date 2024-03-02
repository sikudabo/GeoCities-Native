import axios from 'axios';

type GetDataProps = {
    uri: string;
};

export default async function getData({ uri }: GetDataProps) {
    return await axios({
        method: 'GET',
        url: `${process.env.EXPO_PUBLIC_API_BASE_URI}${uri}`,
    }).then(res => {
        return res.data;
    }).catch(err => {
        const { message } = err.response.data;

        return { isError: true, message };
    });
}