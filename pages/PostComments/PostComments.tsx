import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GeoCitiesBackArrowIcon, GeoCitiesBodyText, colors } from '../../components';

type PostCommentsProps = { 
    route: any;
};

type PostCommentsDisplayLayerProps = {
    handleBackPress: () => void;
};

export default function PostComments({ route }: PostCommentsProps) {
    return <PostComments_DisplayLayer {...useDataLayer({ route })} />;
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

function useDataLayer({ route }: PostCommentsProps) {
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