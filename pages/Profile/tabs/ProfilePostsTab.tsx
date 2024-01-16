import { View, StyleSheet } from 'react-native';
import { GeoCitiesBodyText, colors } from '../../../components';

export default function ProfilePostsTab() {
    return <ProfilePostsTab_DisplayLayer {...useDataLayer()} />;
}

function ProfilePostsTab_DisplayLayer() {
    return (
        <View style={styles.container}>
            <GeoCitiesBodyText color={colors.white} text="Posts tab" />
        </View>
    );
}

function useDataLayer() {
    return {

    }
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
    },
});