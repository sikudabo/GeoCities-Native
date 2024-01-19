import { StyleSheet, View } from 'react-native';
import { GeoCitiesBodyText, colors } from '../../components';

export default function PostComments() {
    return <PostComments_DisplayLayer {...useDataLayer()} />;
}


function PostComments_DisplayLayer() {
    return (
        <View style={styles.container}>
            <GeoCitiesBodyText color={colors.white} text="Post Comments screen" />
        </View>
    );
}

function useDataLayer() {
    return {

    };
}

const styles =  StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
    },
});