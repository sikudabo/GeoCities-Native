import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { GeoCitiesButton, GeoCitiesLinkIcon, colors } from "../../components";

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
                <TextInput activeOutlineColor={colors.salmonPink} label="Text" mode="outlined" numberOfLines={5} outlineColor={colors.white} placeholder="Text..." style={styles.captionInput} multiline />
            </View>
            <View style={styles.attachmentsSection}>
                <GeoCitiesLinkIcon color={colors.white} height={20} width={20} />
            </View>
            <View style={styles.cancelConfirmButtonsContainer}>
                <GeoCitiesButton buttonColor={colors.white} icon="cancel" onPress={handleCancel} text="Cancel" />
                <GeoCitiesButton buttonColor={colors.salmonPink} icon="upload-network" text="Upload" />
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
    attachmentsSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 75,
    },
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
    },
    cancelConfirmButtonsContainer: {
        paddingTop: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    captionInput: {
        height: 100,
        paddingBottom: 5,
    },
    inputBoxContainer: {
        height: 100,
        paddingTop: 20,
    }
});