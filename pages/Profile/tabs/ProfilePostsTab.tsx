import { View, StyleSheet } from 'react-native';
import { GeoCitiesBodyText, GeoCitiesButton, colors } from '../../../components';

export default function ProfilePostsTab() {
    return <ProfilePostsTab_DisplayLayer {...useDataLayer()} />;
}

function ProfilePostsTab_DisplayLayer() {
    return (
        <View style={styles.container}>
            <View style={styles.createPostButtonContainer}>
                <GeoCitiesButton buttonColor={colors.error} icon="pencil" text="Create" textColor={colors.black} />
            </View>
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
    createPostButtonContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
    },
});