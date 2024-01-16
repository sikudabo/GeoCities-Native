import { View, StyleSheet } from 'react-native';
import { GeoCitiesBodyText, GeoCitiesButton, colors } from '../../../components';


type ProfilePostsTabProps = {
    createButtonNavigator: () => void;
};

export default function ProfilePostsTab({
    createButtonNavigator,
}: ProfilePostsTabProps) {
    return <ProfilePostsTab_DisplayLayer createButtonNavigator={createButtonNavigator} {...useDataLayer()} />;
}

function ProfilePostsTab_DisplayLayer({
    createButtonNavigator,
}: ProfilePostsTabProps) {
    return (
        <View style={styles.container}>
            <View style={styles.createPostButtonContainer}>
                <GeoCitiesButton buttonColor={colors.salmonPink} icon="pencil" onPress={createButtonNavigator} text="Create" textColor={colors.black} />
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