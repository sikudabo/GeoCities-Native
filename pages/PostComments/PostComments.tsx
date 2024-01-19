import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GeoCitiesBackArrowIcon, GeoCitiesBodyText, colors } from '../../components';

type PostCommentsDisplayLayerProps = {
    handleBackPress: () => void;
};

export default function PostComments() {
    return <PostComments_DisplayLayer {...useDataLayer()} />;
}


function PostComments_DisplayLayer({
    handleBackPress,
}: PostCommentsDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.backButtonSection}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButtonContainer}>
                    <GeoCitiesBackArrowIcon height={30} width={30} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function useDataLayer() {
    const navigation = useNavigation();

    function handleBackPress() {
        navigation.goBack();
    }

    return {
        handleBackPress,
    };
}

const styles =  StyleSheet.create({
    backButtonContainer: {
        height: 100,
        width: 100,
    },
    backButtonSection: {
        paddingLeft: 10,
        paddingTop: 20,
    },
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        width: '100%',
    },
});