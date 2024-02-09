import { StyleSheet, View } from 'react-native';
import { useFetchGroup } from '../../hooks/fetch-hooks';
import { GeoCitiesAvatar, GeoCitiesBodyText, LoadingIndicator, colors } from '../../components';

type GroupScreenProps = {
    navigation: any;
    route: any;
};

type GroupScreenDisplayLayerProps = {
    avatarUri: string;
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
    groupName,
    isLoading,
}: GroupScreenDisplayLayerProps) {

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <GeoCitiesAvatar size={50} src={avatarUri} />
            </View>
            <View style={styles.groupNameContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={700} text={groupName} />
            </View>
        </View>
    );
}

function useDataLayer({ navigation, route }: GroupScreenProps) {
    const { _id } = route.params.group;
    const { data: group, isLoading } = useFetchGroup(_id);
    const { avatar, groupName } = !isLoading ? group : { 
        avatar: '',
        groupName: '',
    };
    const avatarUri = `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${avatar}`;
    console.log(`The fetched group is: ${group}`);
    return {
        avatarUri,
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
        paddingTop: 10,
        width: '100%',
    },
    groupNameContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
    },
});