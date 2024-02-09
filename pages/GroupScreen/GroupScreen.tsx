import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import {
    Tabs,
    TabsProvider,
    TabScreen,
} from 'react-native-paper-tabs';
import { useUser } from '../../hooks/storage-hooks';
import { useFetchGroup } from '../../hooks/fetch-hooks';
import { GeoCitiesAvatar, GeoCitiesBodyText, LoadingIndicator, colors } from '../../components';

type GroupScreenProps = {
    navigation: any;
    route: any;
};

type GroupScreenDisplayLayerProps = {
    avatarUri: string;
    currentIndex: number;
    description: string;
    groupName: string;
    handleChangeIndex: (index: number) => void;
    isCreator: boolean;
    isLoading: boolean;
}

export default function GroupScreen({
    navigation,
    route,
}: GroupScreenProps) {
    return <GroupScreen_DisplayLayer {...useDataLayer({  navigation, route })} />;
}

function GroupScreen_DisplayLayer({
    avatarUri,
    currentIndex,
    description,
    groupName,
    handleChangeIndex,
    isCreator,
    isLoading,
}: GroupScreenDisplayLayerProps) {

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <ScrollView>
                    <View style={styles.avatarContainer}>
                        <GeoCitiesAvatar size={100} src={avatarUri} />
                    </View>
                    <View style={styles.groupNameContainer}>
                        <GeoCitiesBodyText color={colors.white} fontSize={25} fontWeight={700} text={groupName} />
                    </View>
                    <View style={styles.descriptionContainer}>
                        <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight='normal' text={description} />
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
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

function useDataLayer({ navigation, route }: GroupScreenProps) {
    const { _id } = route.params.group;
    const { user } = useUser();
    const { _id: userId } = user;
    const { data: group, isLoading } = useFetchGroup(_id);
    const { avatar, creator, description, groupName } = !isLoading ? group : { 
        avatar: '',
        creator: '',
        description: '',
        groupName: '',
    };
    const isCreator = creator === userId;
    const avatarUri = `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${avatar}`;
    const [currentIndex, setCurrentIndex] = useState(0);

    function handleChangeIndex(index: number) {
        setCurrentIndex(index);
    }
    
    return {
        avatarUri,
        currentIndex,
        description,
        groupName,
        handleChangeIndex,
        isCreator,
        isLoading,
    };
};

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
    },
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        width: '100%',
    },
    descriptionContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        width: '100%',
    },
    groupNameContainer: {
        alignItems: 'center',
        justifyContent: 'center',
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