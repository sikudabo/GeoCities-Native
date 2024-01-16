import { View, StyleSheet } from 'react-native';
import { GeoCitiesBodyText, colors } from '../../../components';

export default function ProfileAboutTabs() {
    return <ProfileAboutTabs_DisplayLayer {...useDataLayer()} />;
}


function ProfileAboutTabs_DisplayLayer() {
    return (
        <View style={styles.container}>
            <GeoCitiesBodyText color={colors.white} text="About tab" />
        </View>
    );
}

function useDataLayer() {
    return {

    }
};

const styles = StyleSheet.create({
    container: {
    },
});