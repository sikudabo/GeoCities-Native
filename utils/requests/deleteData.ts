import axios from 'axios';

type DeleteDataProps = {
    data: any,
    uri: string;
};

export default async function deleteData({ data, uri }: DeleteDataProps) {
    return await axios({
        data,
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'DELETE',
        url: `${process.env.EXPO_PUBLIC_API_BASE_URI}${uri}`,
    }).then(res => {
        return res.data;
    }).catch(err => {
        return { isError: true, message: 'There was an error deleting that post. Please try again!' };
    });
}