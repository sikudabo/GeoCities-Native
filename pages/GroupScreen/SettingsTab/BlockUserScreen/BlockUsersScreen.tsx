import { StyleSheet, View } from 'react-native';
import { GroupType, UserType } from '../../../../typings';
import { postNonBinaryData } from '../../../../utils/requests';
import { useFetchAllUsers } from '../../../../hooks/fetch-hooks';
import { GeoCitiesBodyText, GeoCitiesButton, LoadingIndicator, colors } from '../../../../components';

type BlockUsersScreenProps = {
    navigation: any;
    route: any;
};

type BlockUsersScreenDisplayLayerProps = {
    isLoading: boolean;
    users: Array<UserType>;
};

type DataLayerProps = {
    group: GroupType
    navigation: any;
};

export default function BlockUsersScreen({
    navigation,
    route,
}: BlockUsersScreenProps) {
    const { group } = route.params;
    return <BlockUsersScreen_DisplayLayer {...useDataLayer({ group, navigation})} />;
}

function BlockUsersScreen_DisplayLayer({
    isLoading,
    users,
}: BlockUsersScreenDisplayLayerProps) {

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerTitleContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="Block Users" />
            </View>
        </View>
    );
}

function useDataLayer({
    group,
    navigation,
}: DataLayerProps) {
    const { blockList, description, groupName, rules, topic } = group;
    const { data: users, isLoading } = useFetchAllUsers();

    return {
        isLoading,
        users: typeof users !== 'undefined' && !isLoading ? users : [],
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        paddingTop: 10,
    },
    headerTitleContainer: {
        alignItems: 'center',
        width: '100%',
    },
});