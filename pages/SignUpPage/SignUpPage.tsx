import { StyleSheet, View } from 'react-native';
import { GeoCitiesBodyText } from '../../components';

export default function SignUpPage() {
    return (
        <View style={styles.loginContainer}>
            <GeoCitiesBodyText text="Sign Up" fontSize={50} fontWeight={900} />
        </View>
    );
}

const styles = StyleSheet.create({
    loginContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        width:'100%',
    },
});