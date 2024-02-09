import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useFetchGroup } from '../../hooks/fetch-hooks';
import { GeoCitiesAvatar, GeoCitiesBodyText, LoadingIndicator, colors } from '../../components';

type GroupScreenProps = {
    navigation: any;
    route: any;
};

type GroupScreenDisplayLayerProps = {
    avatarUri: string;
    description: string;
    groupName: string;
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
    description,
    groupName,
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
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

function useDataLayer({ navigation, route }: GroupScreenProps) {
    const { _id } = route.params.group;
    const { data: group, isLoading } = useFetchGroup(_id);
    const { avatar, description, groupName } = !isLoading ? group : { 
        avatar: '',
        description: '',
        groupName: '',
    };
    const avatarUri = `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${avatar}`;
    
    return {
        avatarUri,
        description,
        groupName,
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
        paddingTop: 20,
        width: '100%',
    },
    groupNameContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
    },
});