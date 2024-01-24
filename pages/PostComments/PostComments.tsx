import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import orderBy from 'lodash/orderBy';
import { useNavigation } from '@react-navigation/native';
import { useFetchPost } from '../../hooks/fetch-hooks';
import { CommentType, PostType } from '../../typings';
import { CommentCard, GeoCitiesBackArrowIcon, GeoCitiesBodyText, LoadingIndicator, PostCard, colors } from '../../components';

type PostCommentsProps = { 
    route: any;
};

type PostCommentsDisplayLayerProps = {
    comments: Array<CommentType>;
    handleBackPress: () => void;
    isLoading: boolean;
    isPostDeleted: boolean;
    post: PostType;
};

export default function PostComments({ route }: PostCommentsProps) {
    return <PostComments_DisplayLayer {...useDataLayer({ route })} />;
}


function PostComments_DisplayLayer({
    comments,
    handleBackPress,
    isLoading,
    isPostDeleted,
    post
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
                <ScrollView>
                    <View style={styles.backButtonSection}>
                        <TouchableOpacity onPress={handleBackPress} style={styles.backButtonContainer}>
                            <GeoCitiesBackArrowIcon height={30} width={30} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.screenBodyContainer}>
                        <PostCard 
                            post={post}
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
                                        <CommentCard 
                                            comment={comment}
                                            key={index} 
                                        />
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

function useDataLayer({ route }: PostCommentsProps) {
    const navigation = useNavigation();
    const { _id } = route.params;
    const { data, isLoading } = useFetchPost({ _id });
    const { isPostDeleted, post } = typeof data !== 'undefined' && !isLoading ? data : { isPostDeleted: false, post: {} };
    const { comments } = !isLoading && post ? post : [];

    function handleBackPress() {
        navigation.goBack();
    }

    return {
        comments: comments.length > 0 ? orderBy(comments, ['createdAt'], ['desc']) : comments,
        handleBackPress,
        isLoading,
        isPostDeleted,
        post,
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