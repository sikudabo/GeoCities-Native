import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { colors } from './colors';

export default function LoadingIndicator() {
    return (
        <View style={styles.loaderContainer}>
            <ActivityIndicator animating={true} color={colors.white} />
        </View>
    );
}

const styles = StyleSheet.create({
    loaderContainer: {
        alignItems: 'center',
        backgroundColor: colors.nightGray,
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        paddingTop: 200,
        width: '100%',
        zIndex: 100,
    }
});