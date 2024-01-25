import { useCallback, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useFetchFeedPosts } from '../../hooks/fetch-hooks';
import { PostType } from '../../typings';
import { colors, GeoCitiesBodyText, LoadingIndicator, PostCard } from '../../components';

type FeedProps = {
    navigation: any;
};

type FeedDisplayLayerProps = {
    isLoading: boolean;
    onRefresh: () => void;
    posts: Array<PostType>;
    refreshing: boolean;
};

export default function Feed({ navigation }: FeedProps) {
    return <Feed_DisplayLayer {...useDataLayer({ navigation })} />;
}

function Feed_DisplayLayer({
    isLoading,
    onRefresh,
    posts,
    refreshing,
}: FeedDisplayLayerProps) {
    
    if (isLoading) {
        return <LoadingIndicator />;
    }

    

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <ScrollView
                    refreshControl={
                        <RefreshControl 
                            onRefresh={onRefresh}
                            refreshing={refreshing}
                            tintColor={colors.white}
                        />
                    }
                >
                    <View style={styles.postsSectionContainer}>
                        {posts.map((post, index) => (
                            <PostCard 
                                key={index}
                                post={post}
                                renderedFrom="feed"
                            />
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

function useDataLayer({ navigation }: FeedProps) {
    const { data: posts, isLoading } = useFetchFeedPosts();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return {
        isLoading,
        onRefresh,
        posts: !isLoading && typeof posts !== 'undefined' ? posts : [],
        refreshing,
    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        paddingTop: 20,
        width: '100%',
    },
    postsSectionContainer: {
        paddingLeft: 10,
        paddingRight: 10,
    },
});

