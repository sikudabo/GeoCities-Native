import { StyleSheet, View } from 'react-native';
import { useFetchGroupPosts } from '../../../hooks/fetch-hooks';
import { PostType } from '../../../typings';
import { GeoCitiesBodyText, LoadingIndicator, PostCard, colors } from '../../../components';

type PostsTabProps = {
    groupName: string;
};

type PostsTabDisplayLayerProps = {
    posts: Array<PostType>;
    isLoading: boolean;
};

export default function PostsTab({
    groupName,
}: PostsTabProps) {
    return <PostsTab_DisplayLayer {...useDataLayer(groupName)} />;
}

function PostsTab_DisplayLayer({
    posts,
    isLoading,
}: PostsTabDisplayLayerProps) {
    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            {typeof posts !== 'undefined' && posts.length < 1 ? (
                <View style={styles.noPostsSectionContainer}>
                    <GeoCitiesBodyText color={colors.white} fontWeight={700} text="No Posts" />
                </View>
            ): (
                <View>
                    {posts.map((post, index) => (
                        <PostCard 
                            post={post}
                            key={index}
                            renderedFrom="group"
                        />
                    ))}
                </View>
            )}
        </View>
    );

}

function useDataLayer(groupName: string) {
    const { data: posts, isLoading  } = useFetchGroupPosts(groupName);

    return {
        posts,
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