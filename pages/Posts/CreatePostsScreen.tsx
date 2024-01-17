import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { GeoCitiesButton, GeoCitiesLinkIcon, GeoCitiesPhotoIcon, GeoCitiesVideoIcon, colors } from "../../components";

type CreatePostsProps = {
    navigation: any;
    route: any;
};

type CreatePostsDisplayLayerProps = {
    caption: string;
    handleCancel: () => void;
    handleCaptionChange: (caption: string) => void;
    isUploadButtonDisabled: boolean;
};

export default function CreatePostScreen({
    navigation,
    route
}: CreatePostsProps) {
    return <CreatePostScreen_DisplayLayer {...useDataLayer({ navigation, route })} />;
}

function CreatePostScreen_DisplayLayer({
    caption,
    handleCancel,
    handleCaptionChange,
    isUploadButtonDisabled,
}: CreatePostsDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.inputBoxContainer}>
                <TextInput activeOutlineColor={colors.salmonPink} label="Text" mode="outlined" numberOfLines={5} onChangeText={handleCaptionChange} outlineColor={colors.white} placeholder="Text..." style={styles.captionInput} value={caption} multiline />
            </View>
            <View style={styles.attachmentsSection}>
                <GeoCitiesPhotoIcon color={colors.white} height={20} width={20} />
                <GeoCitiesLinkIcon color={colors.white} height={20} width={20} />
                <GeoCitiesVideoIcon color={colors.white} height={20} width={20} />
            </View>
            <View style={styles.cancelConfirmButtonsContainer}>
                <GeoCitiesButton buttonColor={colors.white} icon="cancel" onPress={handleCancel} text="Cancel" />
                <GeoCitiesButton buttonColor={colors.salmonPink} disabled={isUploadButtonDisabled} icon="upload-network" text="Upload" />
            </View>
        </View>
    );
}

function useDataLayer({ navigation, route }: CreatePostsProps) {
    const [caption, setCaption] = useState('');
    const [link, setLink] = useState('');
    const [photoName, setPhotoName] = useState('');
    const [photoUri, setPhotoUri] = useState<Blob | null>(null);
    const [videoName, setVideoName] = useState('');
    const [videoUri, setVideoUri] = useState<Blob | null>(null);
    const isUploadButtonDisabled = checkBlankInfo();
    
    function handleCancel() {
        navigation.goBack();
    }

    function handleCaptionChange(caption: string) {
        setCaption(caption);
    }

    function checkBlankInfo() {
        if (!caption.trim() && !link.trim() && !photoName && !videoName) {
            return true;
        }

        return false;
    }

    return {
        caption,
        handleCancel,
        handleCaptionChange,
        isUploadButtonDisabled,
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