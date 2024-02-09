import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import millify from 'millify';
import truncate from 'lodash/truncate';
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
import ProfilePostsTab from './tabs/ProfilePostsTab';
import { GeoCitiesAvatar, GeoCitiesBodyText, GeoCitiesMarkerIcon, colors } from '../../components';
import { useUser } from '../../hooks/storage-hooks';
import { useFetchUserData } from '../../hooks/fetch-hooks';
import { UserType } from '../../typings';

type ProfileProps = {
    navigation: any;
}

type ProfileDisplayLayerProps = {
    avatar: string;
    createPostNavigation: () => void;
    currentIndex: number;
    followerCount: number;
    followingCount: number;
    fullName: string;
    handleChangeIndex: (index: number) => void;
    handleNavigation: () => void;
    onRefresh: () => void;
    refreshing: boolean;
    user: UserType;
    userLocation: string;
};

type NavigationProps = {
    navigation: {
        navigate: (name: string, params?: any) => void;
    };
};

export default function Profile({ navigation }: ProfileProps) {
    return <Profile_DisplayLayer {...useDataLayer({ navigation })} />;
}

function Profile_DisplayLayer({
    avatar,
    createPostNavigation,
    currentIndex,
    followerCount,
    followingCount,
    fullName,
    handleChangeIndex,
    handleNavigation,
    onRefresh,
    refreshing,
    user,
    userLocation,
}: ProfileDisplayLayerProps) {
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
                        <View style={styles.followerStatSection}>
                            <GeoCitiesBodyText color={colors.white} text={millify(followerCount)} textAlign='center'/>
                            <GeoCitiesBodyText color={colors.white} text={followerCount === 1 ? 'Follower' : 'Followers' } />
                        </View>
                        <View style={styles.followerStatSection}>
                            <GeoCitiesBodyText color={colors.white} text={'Following'} />
                            <GeoCitiesBodyText color={colors.white} text={millify(followingCount)} textAlign='center'/>
                        </View>
                    </View>
                    <View style={styles.locationSection}>
                        <GeoCitiesBodyText color={colors.white} text={truncate(userLocation, { length: 40 })} />
                    </View>
                    <View style={styles.tabsSectionContainer}>
                        <TabsProvider defaultIndex={0} onChangeIndex={handleChangeIndex}>
                            <Tabs style={styles.tabsStyle} tabLabelStyle={styles.tabLabel} disableSwipe>
                                <TabScreen icon="mail" label="Posts">
                                    <View style={{ alignItems: 'center',  flex: 1, height: 500, paddingTop: 300 }}>
                                        <GeoCitiesBodyText color={colors.white} fontSize={44} text="Posts" />
                                    </View>
                                </TabScreen>
                                <TabScreen icon="information" label="About">
                                    <ProfileAboutTabs user={user} />
                                </TabScreen>
                                <TabScreen icon="calendar" label="Events">
                                    <ProfileAboutTabs user={user} />
                                </TabScreen>
                            </Tabs>
                        </TabsProvider>
                    </View>
                    <View>
                       {currentIndex === 0 ? (
                            <ProfilePostsTab createButtonNavigator={createPostNavigation} />
                       ): currentIndex === 1 ? (
                            <ProfileAboutTabs user={user} />
                       ): null}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

function useDataLayer({ navigation }: ProfileProps) {
    const { user, setUser } = useUser();
    const { _id } = user;
    const { data, isLoading } = useFetchUserData({ _id });
    const { user: currentUser } = typeof data !== 'undefined' && !isLoading ? data : { user: undefined };
    const { avatar, firstName, followers, following, lastName, locationCity, locationState } = user;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const followerCount = followers.length;
    const followingCount = following.length;
    const userLocation = `${locationCity}, ${locationState}`;

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
        setUser(updatedUser);
    }, [currentUser]);


    function handleNavigation() {
        navigation.navigate('Feed');
    }

    function handleChangeIndex(index: number) {
        setCurrentIndex(index);
    }

    function createPostNavigation() {
        navigation.navigate('CreatePost', { isCommunity: false});
    }

    return {
        avatar,
        createPostNavigation,
        currentIndex,
        followerCount,
        followingCount,
        fullName: `${firstName} ${lastName}`,
        handleChangeIndex,
        handleNavigation,
        onRefresh,
        refreshing,
        user,
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

