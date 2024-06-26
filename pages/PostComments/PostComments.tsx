import { useCallback, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import orderBy from 'lodash/orderBy';
import { useNavigation } from '@react-navigation/native';
import { useFetchPost } from '../../hooks/fetch-hooks';
import { useUser } from '../../hooks/storage-hooks';
import { CommentType, PostType } from '../../typings';
import { CommentCard, GeoCitiesBackArrowIcon, GeoCitiesBodyText, LoadingIndicator, PostCard, colors } from '../../components';

type PostCommentsProps = { 
    navigation: any;
    route: any;
};

type PostCommentsDisplayLayerProps = {
    blockedFrom: Array<string>;
    comments: Array<CommentType>;
    groupName?: string;
    handleBackPress: () => void;
    isLoading: boolean;
    isPostDeleted: boolean;
    onRefresh: () => void;
    post: PostType;
    renderedFrom: string;
    refreshing: boolean;
};

export default function PostComments({ navigation, route }: PostCommentsProps) {
    return <PostComments_DisplayLayer {...useDataLayer({ navigation, route })} />;
}


function PostComments_DisplayLayer({
    blockedFrom,
    comments,
    handleBackPress,
    isLoading,
    isPostDeleted,
    onRefresh,
    post,
    renderedFrom,
    refreshing,
}: PostCommentsDisplayLayerProps) {
    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (isPostDeleted) {
        return (
            <View style={styles.container}>
                <View style={styles.backButtonSection}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButtonContainer}>
                        <GeoCitiesBackArrowIcon height={30} width={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.deletedPostHeader}>
                    <GeoCitiesBodyText color={colors.white} fontSize={32} fontWeight={400} text="Post Deleted!" />
                </View>
            </View>
        );
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
                    <View style={styles.backButtonSection}>
                        <TouchableOpacity onPress={handleBackPress} style={styles.backButtonContainer}>
                            <GeoCitiesBackArrowIcon height={30} width={30} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.screenBodyContainer}>
                        <PostCard 
                            post={post}
                            renderedFrom={renderedFrom}
                            isCommentsScreen
                        />
                        <View style={styles.postCommentsSection}>
                            {typeof comments !== 'undefined' && comments.length === 0 ? (
                                <View style={styles.noCommentsMessageContainer}>
                                    <GeoCitiesBodyText color={colors.white} text="No Comments" />
                                </View>
                            ): (
                                <>
                                    {comments.map((comment, index) => (
                                        <View 
                                            key={index}
                                        >
                                            {!blockedFrom.includes(comment.authorId) && (
                                                <CommentCard 
                                                    comment={comment}
                                                    key={index} 
                                                />
                                            )}
                                        </View>
                                    ))}
                                </>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

function useDataLayer({ navigation, route }: PostCommentsProps) {
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useUser();
    const { blockedFrom } = user;
    const { groupName, _id, renderedFrom } = route.params;
    const { data, isLoading } = useFetchPost({ _id });
    const { isPostDeleted, post } = typeof data !== 'undefined' && !isLoading ? data : { isPostDeleted: false, post: {} };
    const { comments } = !isLoading && post ? post : [];

    function handleBackPress() {
       if (renderedFrom === 'feed') {
            navigation.navigate('Feed');
            return
       } 

       if (renderedFrom === 'profile') {
        navigation.navigate('Profile');
        return;
       }

       if (renderedFrom === 'group') {
        navigation.navigate('GroupScreen', { group: { groupName }});
        return;
       }

       // navigation.goBack();
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return {
        blockedFrom,
        comments: typeof comments !== 'undefined' &&  comments.length > 0 ? orderBy(comments, ['createdAt'], ['desc']) : comments,
        groupName,
        handleBackPress,
        isLoading,
        isPostDeleted,
        onRefresh,
        post,
        renderedFrom,
        refreshing,
    };
}

const styles =  StyleSheet.create({
    backButtonContainer: {
        height: 100,
        width: 100,
    },
    backButtonSection: {
        paddingLeft: 10,
        paddingTop: 20,
    },
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        width: '100%',
    },
    deletedPostHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
    },
    deletedPostText: {
        color: colors.white,
        fontSize: 32,
        fontWeight: '900',
    },
    noCommentsMessageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
    },
    postCommentsSection: {

    },
    screenBodyContainer: {
        height: '100%',
    },
});