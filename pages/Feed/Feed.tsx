import { useCallback, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useUser } from '../../hooks/storage-hooks';
import { useFetchFeedPosts, useFetchUserData } from '../../hooks/fetch-hooks';
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
    const { user, setUser } = useUser();
    const { _id } = user;
    const { data: userData, isLoading: isLoadingUserData } = useFetchUserData({ _id });
    const { user: fetchedUser } = typeof userData !== 'undefined' && !isLoading ? userData : { user : undefined };
    const [refreshing, setRefreshing] = useState(false);
    let filteredPosts = [];

    function hidePost(groupName: string | undefined, authorId: string | undefined) {
        if (groupName) {
            if (fetchedUser.groupsBlockedFrom.includes(groupName)) {
                return true;
            }
        }

        if (fetchedUser.blockedFrom.includes(authorId)) {
            return true;
        }

        return false;

    }

    if (!isLoading && !isLoadingUserData && typeof fetchedUser !== 'undefined') {
        filteredPosts = posts.filter((post: { groupName: string | undefined; authorId: string }) => !hidePost(post.groupName, post.authorId));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return {
        isLoading,
        onRefresh,
        posts: !isLoading && typeof filteredPosts !== 'undefined' ? filteredPosts : [],
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

