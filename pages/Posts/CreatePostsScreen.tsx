import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { GeoCitiesButton, colors } from "../../components";

type CreatePostsProps = {
    navigation: any;
    route: any;
};

type CreatePostsDisplayLayerProps = {
    handleCancel: () => void;
};

export default function CreatePostScreen({
    navigation,
    route
}: CreatePostsProps) {
    return <CreatePostScreen_DisplayLayer {...useDataLayer({ navigation, route })} />;
}

function CreatePostScreen_DisplayLayer({
    handleCancel
}: CreatePostsDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.inputBoxContainer}>
                <TextInput numberOfLines={5} multiline />
            </View>
            <View style={styles.cancelConfirmButtonsContainer}>
                <GeoCitiesButton buttonColor={colors.white} mode="text" onPress={handleCancel} text="Cancel" />
            </View>
        </View>
    );
}

function useDataLayer({ navigation, route }: CreatePostsProps) {
    
    function handleCancel() {
        navigation.goBack();
    }

    return {
        handleCancel,
    };
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
    },
    cancelConfirmButtonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputBoxContainer: {
        paddingTop: 20,
    }
});