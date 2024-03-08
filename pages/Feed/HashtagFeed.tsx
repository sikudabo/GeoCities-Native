import { useCallback, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useFetchHashtagFeedPosts } from '../../hooks/fetch-hooks';
import { PostType } from '../../typings';
import { colors, LoadingIndicator, PostCard } from '../../components';

type HashtagFeedProps = {
    route: any;
};

type HashtagFeedDisplayLayerProps = {
    isLoading: boolean;
    onRefresh: () => void;
    posts: Array<PostType>;
    refreshing: boolean;
};

type DataLayerProps = {
    hashtag: string;
};

export default function HashtagFeed({ route }: HashtagFeedProps) {
    const { hashtag } = route.params;
    return <HashtagFeed_DisplayLayer {...useDataLayer({ hashtag })} />;
}

function HashtagFeed_DisplayLayer({
    isLoading,
    onRefresh,
    posts,
    refreshing,
}: HashtagFeedDisplayLayerProps) {
    
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

function useDataLayer({ hashtag }: DataLayerProps) {
    const [refreshing, setRefreshing] = useState(false);
    const { data: posts, isLoading } = useFetchHashtagFeedPosts(hashtag);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return {
        isLoading,
        onRefresh,
        posts: typeof posts!== 'undefined' && !isLoading ? posts : [],
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

