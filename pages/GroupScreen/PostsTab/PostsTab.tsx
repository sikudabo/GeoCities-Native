import { StyleSheet, View } from 'react-native';
import { useFetchGroupPosts } from '../../../hooks/fetch-hooks';
import { PostType } from '../../../typings';
import { GeoCitiesBodyText, LoadingIndicator, colors } from '../../../components';

type PostsTabProps = {
    groupName: string;
};

type PostsTabDisplayLayerProps = {
    data: Array<PostType>;
    isLoading: boolean;
};

export default function PostsTab({
    groupName,
}: PostsTabProps) {
    return <PostsTab_DisplayLayer {...useDataLayer(groupName)} />;
}

function PostsTab_DisplayLayer({
    data,
    isLoading,
}: PostsTabDisplayLayerProps) {
    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            {typeof data !== 'undefined' && data.length < 1 ? (
                <View style={styles.noPostsSectionContainer}>
                    <GeoCitiesBodyText color={colors.white} fontWeight={700} text="No Posts" />
                </View>
            ): (
                <GeoCitiesBodyText color={colors.white} text="Posts" />
            )}
        </View>
    );

}

function useDataLayer(groupName: string) {
    const { data, isLoading  } = useFetchGroupPosts(groupName);

    return {
        data,
        isLoading,
    };
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 30,
    },
    noPostsSectionContainer: {
        alignItems: 'center',
    },
});