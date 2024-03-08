import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import millify from 'millify';
import truncate from 'lodash/truncate';
import { useQueryClient } from '@tanstack/react-query';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import {
    Tabs,
    TabsProvider,
    TabScreen,
    useTabIndex,
    useTabNavigation,
} from 'react-native-paper-tabs';
import ProfileAboutTabs from './tabs/ProfileAboutTab';
import ProfileEventsTab from './tabs/ProfileEventsTab';
import ProfilePostsTab from './tabs/ProfilePostsTab';
import { GeoCitiesAvatar, GeoCitiesBodyText, GeoCitiesButton, GeoCitiesMarkerIcon, LoadingIndicator, colors } from '../../components';
import { postNonBinaryData } from '../../utils/requests';
import { useShowDialog, useShowLoader } from '../../hooks';
import { useUser } from '../../hooks/storage-hooks';
import { useFetchUserData } from '../../hooks/fetch-hooks';
import { GroupType, UserType } from '../../typings';

type ProfileProps = {
    navigation: any;
    route: any;
}

type ProfileDisplayLayerProps = {
    avatar: string;
    createPostNavigation: () => void;
    currentIndex: number;
    followerCount: number;
    followingCount: number;
    fullName: string;
    handleChangeIndex: (index: number) => void;
    handleFollowersFollowingClick: (isFollowers: boolean) => void;
    handleFollowUnfollowPress: () => void;
    handleNavigation: () => void;
    isBlocked: boolean;
    isFollowing: boolean;
    isLoading: boolean;
    isVisitor: boolean | undefined;
    onRefresh: () => void;
    refreshing: boolean;
    user: UserType;
    userGroups: Array<GroupType>;
    userId: string | undefined;
    userLocation: string;
};

type NavigationProps = {
    navigation: {
        navigate: (name: string, params?: any) => void;
    };
};

export default function Profile({ navigation, route }: ProfileProps) {
    return <Profile_DisplayLayer {...useDataLayer({ navigation, route })} />;
}

function Profile_DisplayLayer({
    avatar,
    createPostNavigation,
    currentIndex,
    followerCount,
    followingCount,
    fullName,
    handleChangeIndex,
    handleFollowersFollowingClick,
    handleFollowUnfollowPress,
    handleNavigation,
    isBlocked,
    isFollowing,
    isLoading,
    isVisitor,
    onRefresh,
    refreshing,
    user,
    userGroups,
    userId,
    userLocation,
}: ProfileDisplayLayerProps) {
    if (isLoading || typeof user === 'undefined' || !user.avatar) {
        return <LoadingIndicator />;
    }

    if (isBlocked) {
        return (
            <View style={styles.container}>
                <View style={styles.blockedHeaderContainer}>
                    <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="Blocked" />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeAreaContainer}>
                <ScrollView
                    refreshControl={
                        <RefreshControl 
                            onRefresh={onRefresh}
                            refreshing={refreshing}
                            tintColor={colors.white}
                        />
                    }
                >
                    <View style={styles.avatarContainer}>
                        <GeoCitiesAvatar src={`${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${avatar}`} size={120} />
                    </View>
                    <View style={styles.nameContainer}>
                        <GeoCitiesBodyText color={colors.white} fontSize={24} fontWeight={900} text={truncate(fullName, { length: 40 })} />
                    </View>
                    <View style={styles.profileStatsSection}>
                        <TouchableOpacity onPress={() => followerCount === 0 ? {} : handleFollowersFollowingClick(true)} style={styles.followerStatSection}>
                            <GeoCitiesBodyText color={colors.white} text={millify(followerCount)} textAlign='center'/>
                            <GeoCitiesBodyText color={colors.white} text={followerCount === 1 ? 'Follower' : 'Followers' } />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => followingCount === 0 ? {} : handleFollowersFollowingClick(false)} style={styles.followerStatSection}>
                            <GeoCitiesBodyText color={colors.white} text={'Following'} />
                            <GeoCitiesBodyText color={colors.white} text={millify(followingCount)} textAlign='center'/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.locationSection}>
                        <GeoCitiesMarkerIcon color={colors.salmonPink} height={25} width={30} />
                        <GeoCitiesBodyText color={colors.white} text={truncate(userLocation, { length: 40 })} />
                    </View>
                    {isVisitor && (
                        <View style={styles.followButtonContainer}>
                            <GeoCitiesButton buttonColor={isFollowing ? colors.error : colors.salmonPink} mode={isFollowing ? 'contained' : 'outlined'} onPress={handleFollowUnfollowPress} text={isFollowing ? 'Unfollow' : 'Follow'} />
                        </View>
                    )}
                    <View style={styles.tabsSectionContainer}>
                        <TabsProvider defaultIndex={0} onChangeIndex={handleChangeIndex}>
                            <Tabs style={styles.tabsStyle} tabLabelStyle={styles.tabLabel} disableSwipe>
                                <TabScreen icon="mail" label="Posts">
                                    <View style={{ alignItems: 'center',  flex: 1, height: 500, paddingTop: 300 }}>
                                        <GeoCitiesBodyText color={colors.white} fontSize={44} text="Posts" />
                                    </View>
                                </TabScreen>
                                <TabScreen icon="information" label="About">
                                    <ProfileAboutTabs user={user} userGroups={userGroups} />
                                </TabScreen>
                                <TabScreen icon="calendar" label="Events">
                                    <ProfileAboutTabs user={user} userGroups={userGroups} />
                                </TabScreen>
                            </Tabs>
                        </TabsProvider>
                    </View>
                    <View>
                       {currentIndex === 0 ? (
                            <ProfilePostsTab createButtonNavigator={createPostNavigation} isVisitor={isVisitor} userId={userId} />
                       ): currentIndex === 1 ? (
                            <ProfileAboutTabs user={user} userGroups={userGroups} />
                       ): currentIndex === 2 ? (
                            <ProfileEventsTab userId={user._id}/>
                       ): null}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

function useDataLayer({ navigation, route }: ProfileProps) {
    const { isVisitor, userId } = typeof route.params !== 'undefined' ? route.params : { isVisitor: false, userId: undefined };
    const { user, setUser } = useUser();
    const { _id } = user;
    const idToUse = isVisitor ? userId : _id;
    const { data, isLoading } = useFetchUserData({ _id: idToUse });
    const { user: currentUser, userGroups } = typeof data !== 'undefined' && !isLoading ? data : { user: undefined, userGroups: [] };
    const { avatar, blockedList, firstName, followers, following, lastName, locationCity, locationState } = typeof currentUser !== 'undefined' ? currentUser : {
        avatar: '',
        blockedList: [],
        firstName: '',
        followers: [],
        following: [],
        lastName: '',
        locationCity: '',
        locationState: '',
    }
    const [currentIndex, setCurrentIndex] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const followerCount = followers.length;
    const followingCount = following.length;
    const userLocation = `${locationCity}, ${locationState}`;
    const queryClient = useQueryClient();
    const { setIsLoading } = useShowLoader();
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError, } = useShowDialog();

    const isBlocked = useMemo(() => {
        if (isVisitor && typeof blockedList !== 'undefined' && blockedList.includes(_id)) {
            return true;
        }

        return false;
    }, [blockedList]);
    
    const isFollowing = useMemo(() => {
        if (typeof followers !== 'undefined' && isVisitor && followers.includes(_id)) {
            return true;
        }

        return false;
    }, [followers]);
    

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    useEffect(() => {
        if (!currentUser) {
            return;
        }
    
        let updatedUser = currentUser;
        updatedUser.isLoggedIn = true;
        if (currentUser._id === _id) {
            setUser(updatedUser);
        }
    }, [currentUser, isVisitor]);

    function handleFollowersFollowingClick(isFollowers: boolean) {
        navigation.navigate('FollowersFollowing', { _id: currentUser._id, isCurrentUser: _id === currentUser._id, isFollowers });
        return;
    }


    function handleNavigation() {
        navigation.navigate('Feed');
    }

    function handleChangeIndex(index: number) {
        setCurrentIndex(index);
    }

    function createPostNavigation() {
        navigation.navigate('CreatePost', { isCommunity: false });
    }

    async function handleFollowUnfollowPress() {
        setIsLoading(true);

        await postNonBinaryData({
            data: {
                _id: idToUse,
                followerId: _id,
                isFollow: !isFollowing,

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
            console.log(`There was an error ${isFollowing ? 'unfollowing' : 'following'} this user: ${err.message}`);
            setDialogMessage(`There was an error ${isFollowing ? 'unfollowing' : 'following'} this user. Please try again!`);
            setDialogTitle('Uh Oh!');
            setIsError(true);
            handleDialogMessageChange(true);
            return;
        });
    }

    return {
        avatar,
        createPostNavigation,
        currentIndex,
        followerCount,
        followingCount,
        fullName: `${firstName} ${lastName}`,
        handleChangeIndex,
        handleFollowersFollowingClick,
        handleFollowUnfollowPress,
        handleNavigation,
        isBlocked,
        isFollowing,
        isLoading,
        isVisitor,
        onRefresh,
        refreshing,
        user: currentUser,
        userGroups,
        userId: idToUse,
        userLocation,
    };
}

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 20,
        width: '100%',
    },
    blockedHeaderContainer: {
        alignItems: 'center',
        paddingTop: 20,
    },
    container: {
        alignItems: 'center',
        backgroundColor: colors.nightGray,
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        paddingTop: 10,
    },
    divider: {
        color: colors.white,
    },
    followerStatSection: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: 2,
    },
    followButtonContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 30,
        width: '100%',
    },
    locationSection: {
        columnGap: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        lineHeight: 'normal',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 40,
        width: '100%',
    },
    nameContainer: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 10,
    },
    profileStatsSection: {
        columnGap: 25,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 10,
        paddingTop: 30,
        width: '100%',
    },
    safeAreaContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
    },
    tabLabel: {
        color: colors.white,
        fontFamily: 'Montserrat_700Bold',
    },
    tabsSectionContainer: {
        paddingTop: 30,
    },
    tabsStyle: {
        color: colors.white,
        width: '100%',
    },
});