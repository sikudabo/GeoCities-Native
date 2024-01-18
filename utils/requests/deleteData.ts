import axios from 'axios';

type DeleteDataProps = {
    data: any,
    uri: string;
};

export default async function deleteData({ data, uri }: DeleteDataProps) {
    return await axios({
        data,
        url: `${process.env.EXPO_PUBLIC_API_BASE_URI}${uri}`,
    }).then(res => {
        return res.data;
    }).catch(err => {
        const { message } = err.response.data;
        return { isError: true, message };
    });
}