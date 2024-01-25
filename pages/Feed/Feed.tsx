import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useFetchFeedPosts } from '../../hooks/fetch-hooks';
import { PostType } from '../../typings';
import { colors, GeoCitiesBodyText, LoadingIndicator, PostCard } from '../../components';

type FeedProps = {
    navigation: any;
};

type FeedDisplayLayerProps = {
    isLoading: boolean;
    posts: Array<PostType>;
};

export default function Feed({ navigation }: FeedProps) {
    return <Feed_DisplayLayer {...useDataLayer({ navigation })} />;
}

function Feed_DisplayLayer({
    isLoading,
    posts,
}: FeedDisplayLayerProps) {
    
    if (isLoading) {
        return <LoadingIndicator />;
    }

    

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <ScrollView>
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

    return {
        isLoading,
        posts: !isLoading && typeof posts !== 'undefined' ? posts : [],
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

