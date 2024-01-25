import { StyleSheet, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query'
import { useUser } from '../../hooks/storage-hooks';
import { GeoCitiesBodyText, colors } from '../../components';

export default function BuildGroup() {
    return <BuildGroup_DisplayLayer {...useDataLayer()} />;
}

function BuildGroup_DisplayLayer() {
    return (
        <View style={styles.container}>
            <View style={styles.topHeader}>
                <GeoCitiesBodyText color={colors.white} fontSize={32} text='Create Group' />
            </View>
        </View>
    );
}

function useDataLayer() {
    const { user } = useUser();
    const { _id } = user;
    const queryClient = useQueryClient();

    return {

    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        paddingTop: 50,
        width: '100%',
    },
    topHeader: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
    },
});