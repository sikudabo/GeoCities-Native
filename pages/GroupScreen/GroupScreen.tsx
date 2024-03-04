import {  useCallback, useMemo, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import {
    Tabs,
    TabsProvider,
    TabScreen,
} from 'react-native-paper-tabs';
import AboutTab from './AboutTab/AboutTab';
import PostsTab from './PostsTab/PostsTab';
import SettingsTab from './SettingsTab/SettingsTab';
import { useUser } from '../../hooks/storage-hooks';
import { useFetchGroup } from '../../hooks/fetch-hooks';
import { postNonBinaryData } from '../../utils/requests';
import { useShowDialog, useShowLoader } from '../../hooks';
import { GroupType, UserType } from '../../typings';
import { GeoCitiesAvatar, GeoCitiesBodyText, GeoCitiesButton, LoadingIndicator, colors } from '../../components';

type GroupScreenProps = {
    navigation: any;
    route: any;
};

type GroupScreenDisplayLayerProps = {
    avatarUri: string;
    blockedUsers: Array<UserType>;
    currentIndex: number;
    description: string;
    group: GroupType;
    groupName: string;
    handleChangeIndex: (index: number) => void;
    handleCreatePost: () => void;
    handleLeaveJoinGroup: () => void;
    isBlocked: boolean;
    isCreator: boolean;
    isLoading: boolean;
    isMember: boolean;
    onRefresh: () => void;
    refreshing: boolean;
    settingsIndex?: boolean;
}

export default function GroupScreen({
    navigation,
    route,
}: GroupScreenProps) {
    return <GroupScreen_DisplayLayer {...useDataLayer({  navigation, route })} />;
}

function GroupScreen_DisplayLayer({
    avatarUri,
    blockedUsers,
    currentIndex,
    description,
    group,
    groupName,
    handleChangeIndex,
    handleCreatePost,
    handleLeaveJoinGroup,
    isBlocked,
    isCreator,
    isLoading,
    isMember,
    onRefresh,
    refreshing,
    settingsIndex,
}: GroupScreenDisplayLayerProps) {

    if (isLoading) {
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
                    <View style={styles.avatarContainer}>
                        <GeoCitiesAvatar size={100} src={avatarUri} />
                    </View>
                    <View style={styles.groupNameContainer}>
                        <GeoCitiesBodyText color={colors.white} fontSize={25} fontWeight={700} text={groupName} />
                    </View>
                    <View style={styles.descriptionContainer}>
                        <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight='normal' text={description} />
                    </View>
                    {!isCreator && (
                        <View style={styles.joinButtonContainer}>
                            <GeoCitiesButton buttonColor={isMember ? colors.white : colors.error} mode={isMember ? 'outlined' : 'contained'} onPress={handleLeaveJoinGroup} text={isMember ? 'Leave' : 'Join' } />
                        </View>
                    )}
                    {isMember && (
                        <View style={styles.createButtonContainer}>
                            <GeoCitiesButton buttonColor={colors.salmonPink} icon="pencil" onPress={handleCreatePost} text="Create" />
                        </View>
                    )}
                    <View style={styles.tabsSectionContainer}>
                        <TabsProvider defaultIndex={settingsIndex ? 2 : 0} onChangeIndex={handleChangeIndex}>
                            <Tabs style={styles.tabsStyle} tabLabelStyle={styles.tabLabel} disableSwipe>
                                <TabScreen icon="mail" label="Posts">
                                    <View style={{ alignItems: 'center',  flex: 1, height: 500, paddingTop: 300 }}>
                                        <GeoCitiesBodyText color={colors.white} fontSize={44} text="Posts" />
                                    </View>
                                </TabScreen>
                                <TabScreen icon="information" label="About">
                                    <GeoCitiesBodyText color={colors.white} fontSize={44} text="About" />
                                </TabScreen>
                                {isCreator && (
                                    <TabScreen icon="cog" label="Settings">
                                        <GeoCitiesBodyText color={colors.white} fontSize={44} text="About" />
                                    </TabScreen>
                                )}
                            </Tabs>
                        </TabsProvider>
                    </View>
                    {currentIndex === 0 && (
                        <PostsTab groupName={groupName} />
                    )}
                    {currentIndex === 1 && (
                        <AboutTab group={group} />
                    )}
                    {currentIndex === 2 && (
                        <SettingsTab blockedUsers={blockedUsers} group={group} />
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

function useDataLayer({ navigation, route }: GroupScreenProps) {
    const queryClient = useQueryClient();
    const [refreshing, setRefreshing]= useState(false);
    const { groupName: name } = route.params.group;
    const { settingsIndex } = route.params;
    const { user } = useUser();
    const { _id: userId } = user;
    const { data, isLoading } = useFetchGroup(name);
    const { blockedUsers, group } = typeof data !== 'undefined' && !isLoading ? data : { group: {}, blockedUsers: [] }
    const { avatar, blockList, creator, description, groupName, _id, members } = !isLoading && group ? group : { 
        avatar: '',
        blockList: [],
        creator: '',
        description: '',
        groupName: '',
        _id: '',
        members: [],
    };
    const isCreator = creator === userId;
    const isMember = useMemo(() => {
        return (members as Array<string>).includes(userId);
    }, [data]);
   
    const avatarUri = `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${avatar}`;
    const [currentIndex, setCurrentIndex] = useState(0);
    const { setIsLoading } = useShowLoader();
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError, } = useShowDialog();

    const isBlocked = useMemo(() => {
        if (blockList.includes(userId)) {
            return true;
        }
        return false;
    }, [blockList]);

    function handleChangeIndex(index: number) {
        setCurrentIndex(index);
    }

    function handleCreatePost() {
        navigation.navigate('CreatePost', { group, groupId: _id, groupName, isCommunity: true });
    }

    async function handleLeaveJoinGroup() {
        setIsLoading(true);

        await postNonBinaryData({
            data: {
                groupName,
                _id: userId,
                isLeave: isMember,
            },
            uri: 'join-group',
        }).then(res => {
            const { isError, message } = res;
            if (!isError) {
                queryClient.invalidateQueries(['fetchGroup']);
            }
            setIsLoading(false);
            setDialogMessage(message);
            setDialogTitle(isError ? 'Whoops!' : 'Success!');
            setIsError(isError);
            handleDialogMessageChange(true);
            return;
        }).catch(err => {
            console.log(`There was an error ${isMember ? 'leaving' : 'joining'} a group: ${err.message}`);
            setIsLoading(false);
            setDialogMessage(`There was an error ${isMember ? 'leaving' : 'joining'} ${groupName}. Please try again!`);
            setIsError(true);
            handleDialogMessageChange(true);
        });
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    
    return {
        avatarUri,
        blockedUsers,
        currentIndex,
        description,
        groupName,
        group,
        handleChangeIndex,
        handleCreatePost,
        handleLeaveJoinGroup,
        isBlocked,
        isCreator,
        isLoading,
        isMember,
        onRefresh,
        refreshing,
        settingsIndex,
    };
};

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
    },
    blockedHeaderContainer: {
        alignItems: 'center',
    },
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        paddingTop: 20,
        width: '100%',
    },
    createButtonContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
    },
    descriptionContainer: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        width: '100%',
    },
    groupNameContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
    },
    joinButtonContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
    },
    tabsSectionContainer: {
        paddingTop: 30,
    },
    tabLabel: {
        color: colors.white,
        fontFamily: 'Montserrat_700Bold',
    },
    tabsStyle: {
        color: colors.white,
        width: '100%',
    },
});