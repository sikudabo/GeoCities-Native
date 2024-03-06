import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchFollowers, useFetchFollowing } from '../../hooks/fetch-hooks';
import { UserType } from '../../typings';
import { postNonBinaryData } from '../../utils/requests';
import { useUser } from '../../hooks/storage-hooks';
import { useShowDialog, useShowLoader } from '../../hooks';
import { GeoCitiesAvatar, GeoCitiesBackArrowIcon, GeoCitiesButton, GeoCitiesBodyText, LoadingIndicator, colors } from '../../components';

type FollowersFollowingProps = {
    navigation: any;
    route: any;
};

type FollowersFollowingDisplayLayerProps = {
    currentUserId: string;
    followUnfollowUser: (_id: string, isFollow: boolean) => void;
    handleBackPress: () => void;
    headerText: string;
    isFollower: (followers: Array<string>) => boolean;
    isLoading: boolean;
    users: Array<UserType>;
}

type DataLayerProps = Pick<FollowersFollowingProps, 'navigation'> & {
    _id: string;
    isCurrentUser: boolean;
    isFollowers: boolean;
};

export default function FollowersFollowing({
    navigation,
    route,
}: FollowersFollowingProps) {
    const { _id, isCurrentUser, isFollowers } = route.params;

    return <FollowersFollowing_DisplayLayer {...useDataLayer({ _id, isCurrentUser, isFollowers, navigation })} />;
}

function FollowersFollowing_DisplayLayer({
    currentUserId,
    followUnfollowUser,
    handleBackPress,
    headerText,
    isFollower,
    isLoading,
    users,
}: FollowersFollowingDisplayLayerProps) {
    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButtonContainer}>
                    <GeoCitiesBackArrowIcon color={colors.white} height={25} width={25} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text={headerText} />
                </View>
            </View>
            <View style={styles.bodyContainer}>
                <SafeAreaView>
                    <ScrollView>
                        {users.map((user, index) => (
                            <View 
                                key={index}
                                style={styles.userContainer}
                            >
                                <View style={styles.userAvatarContainer}>
                                    <GeoCitiesAvatar size={35} src={`${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${user.avatar}`} />
                                </View>
                                <View style={styles.userNameContainer}>
                                    <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight='normal' text={`${user.firstName} ${user.lastName}`} />
                                </View>
                                {user._id !== currentUserId && (
                                    <View style={styles.followButtonContainer}>
                                        <GeoCitiesButton buttonColor={colors.salmonPink} mode={isFollower(user.followers) ? 'outlined' : 'contained'} onPress={() => followUnfollowUser(user._id, !isFollower(user.followers))} text={isFollower(user.followers) ? 'Unfollow' : 'Follow'} />
                                    </View>
                                )}
                            </View>
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </View>
        </View>
    );
}

function useDataLayer({
    _id,
    isCurrentUser,
    isFollowers,
    navigation,
}: DataLayerProps) {
    const queryClient = useQueryClient();
    const { data: users, isLoading } = isFollowers ? useFetchFollowers({ _id }) : useFetchFollowing({ _id });
    const { setIsLoading } = useShowLoader();
    const { user } = useUser();
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError } = useShowDialog();
    const { _id: currentUserId } = user;
    const headerText = isFollowers ? 'Followers' : 'Following';

    function handleBackPress() {
        if (isCurrentUser) {
            navigation.navigate('Profile');
            return;
        }

        navigation.navigate('Profile', { isVisitor: true, userId: _id });
        return;
    }

    function isFollower(followers: Array<string>) {
        return followers.includes(currentUserId);
    }

    async function followUnfollowUser(_id: string, isFollow: boolean) {
        setIsLoading(true);

        await postNonBinaryData({
            data: {
                _id,
                followerId: currentUserId,
                isFollow,
            },
            uri: 'follow-unfollow-user',
        }).then(res => {
            const { isError, message } = res;
            setIsLoading(false);

            if(!isError) {
                queryClient.invalidateQueries(['fetchUser'])
            }

            if (isError) {
                setDialogMessage(message);
                setDialogTitle('Uh Oh!');
                setIsError(true);
                handleDialogMessageChange(true);
                return;
            }
        }).catch(err => {
            setIsLoading(false);
            console.log(`There was an error this user ${isFollow ? 'following' : 'unfollowing'} this user: ${err.message}`);
            setDialogMessage(`There was an error this ${isFollow ? 'following' : 'unfollowing'} user. Please try again!`);
            setDialogTitle('Uh Oh!');
            setIsError(true);
            handleDialogMessageChange(true);
            return;
        });
    }

    return {
        currentUserId,
        followUnfollowUser,
        handleBackPress,
        headerText,
        isFollower,
        isLoading,
        users: isLoading || typeof users === 'undefined' ? [] : users,
    };
}

const styles = StyleSheet.create({
    backButtonContainer: {
     flex: 1,
    },
    bodyContainer: {
        height: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
    },
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        paddingTop: 20,
    },
    followButtonContainer: {
        marginLeft: 'auto',
        flex: 1,
    },
    header: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 50,
        paddingLeft: 10,
        paddingRight: 10,
    },
    headerTitleContainer: {
        flex: 2,
    },
    userAvatarContainer: {
        
    },
    userContainer: {
        columnGap: 20,
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: 20,
    },
    userNameContainer: {
        flex: 1,
        paddingTop: 10,
    },
});