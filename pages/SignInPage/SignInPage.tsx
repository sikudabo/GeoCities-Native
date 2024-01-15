import { StyleSheet, View } from 'react-native';
import { GeoCitiesBodyText } from '../../components';

export default function SignInPage() {
    return <SignInPage_DisplayLayer {...useDataLayer()} />;
}

function SignInPage_DisplayLayer() {
    return (
        <View>
            <GeoCitiesBodyText fontSize={50} fontWeight={900} text="Sign In Page" />
        </View>
    );
}

function useDataLayer() {
    return {

    };
}