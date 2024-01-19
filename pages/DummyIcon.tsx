import { View, StyleSheet } from 'react-native';
import { GeoCitiesLogo } from '../components';
import { colors } from '../components';

export default function DummyIcon() {
    return (
        <View style={styles.container}>
            <GeoCitiesLogo color={colors.nightGray} height={400} width={400} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: colors.white,
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
    },
});