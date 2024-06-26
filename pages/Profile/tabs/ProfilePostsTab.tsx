import { View, StyleSheet } from 'react-native';
import { PostType } from '../../../typings';
import { useFetchUserProfilePosts } from '../../../hooks/fetch-hooks';
import { useUser } from '../../../hooks/storage-hooks';
import { GeoCitiesBodyText, GeoCitiesButton, LoadingIndicator, PostCard, colors } from '../../../components';


type ProfilePostsTabProps = {
    createButtonNavigator: () => void;
    isVisitor: boolean | undefined;
    userId: string | undefined;
};

type ProfilePostsTabDisplayLayerProps = Omit<ProfilePostsTabProps, 'userId'>& {
    isLoading: boolean;
    posts: Array<PostType>;
};

export default function ProfilePostsTab({
    createButtonNavigator,
    isVisitor,
    userId,
}: ProfilePostsTabProps) {
    return <ProfilePostsTab_DisplayLayer createButtonNavigator={createButtonNavigator} isVisitor={isVisitor} {...useDataLayer(userId)} />;
}

function ProfilePostsTab_DisplayLayer({
    createButtonNavigator,
    isLoading,
    isVisitor,
    posts,
}: ProfilePostsTabDisplayLayerProps) {
    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            {!isVisitor && (
                <View style={styles.createPostButtonContainer}>
                    <GeoCitiesButton buttonColor={colors.salmonPink} icon="pencil" onPress={createButtonNavigator} text="Create" textColor={colors.black} />
                </View>
            )}
            <View style={styles.postsSection}>
                {posts.map((post, index) => (
                    <PostCard 
                        key={index}
                        post={post}
                    />
                ))}
            </View>
        </View>
    );
}

function useDataLayer(userId: string | undefined) {
    const { user } = useUser();
    const { _id } = user;
    const idToUse = typeof userId !== 'undefined' ? userId : _id;
    const { data: posts, isLoading } = useFetchUserProfilePosts({ _id: idToUse });
    
    return {
        isLoading,
        posts,
    };
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
    },
    createPostButtonContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
    },
    postsSection: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
    },
});