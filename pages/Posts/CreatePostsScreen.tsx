import { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Dialog, Portal, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useShowDialog } from '../../hooks';
import { checkValidUrl } from '../../utils/helpers';
import { GeoCitiesBodyText, GeoCitiesButton, GeoCitiesLinkIcon, GeoCitiesPhotoIcon, GeoCitiesVideoIcon, colors } from "../../components";

type CreatePostsProps = {
    navigation: any;
    route: any;
};

type CreatePostsDisplayLayerProps = {
    caption: string;
    confirmValidLink: () => void;
    handleCancel: () => void;
    handleCaptionChange: (caption: string) => void;
    handleLinkChange: (link: string) => void;
    isLinkDialogOpen: boolean;
    isUploadButtonDisabled: boolean;
    launchPhotoPicker: () => void;
    launchVideoPicker: () => void;
    link: string;
    toggleLinkDialog: () => void;
    uploadPost: () => void;
};

export default function CreatePostScreen({
    navigation,
    route
}: CreatePostsProps) {
    return <CreatePostScreen_DisplayLayer {...useDataLayer({ navigation, route })} />;
}

function CreatePostScreen_DisplayLayer({
    caption,
    confirmValidLink,
    handleCancel,
    handleCaptionChange,
    handleLinkChange,
    isLinkDialogOpen,
    isUploadButtonDisabled,
    launchPhotoPicker,
    launchVideoPicker,
    link,
    toggleLinkDialog,
    uploadPost,
}: CreatePostsDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <Portal>
                <Dialog dismissable={false} style={styles.linkDialog} visible={isLinkDialogOpen}>
                    <Dialog.Title>
                        <GeoCitiesBodyText color={colors.white} text="Attach a link" />
                    </Dialog.Title>
                    <Dialog.Content style={styles.linkDialogContentContainer}>
                        <TextInput activeOutlineColor={colors.salmonPink} label="Link" mode="outlined" outlineColor={colors.white} onChangeText={handleLinkChange} placeholder="Link..." value={link} />
                    </Dialog.Content>
                    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={400}>
                    <View style={styles.linkDialogActionsContainer}>
                        <GeoCitiesButton buttonColor={colors.white} icon="cancel" onPress={toggleLinkDialog} text="Cancel" />
                        <GeoCitiesButton buttonColor={colors.salmonPink} icon="attachment" onPress={confirmValidLink} text="Attach" />
                    </View>
                    </KeyboardAvoidingView>
                </Dialog>
            </Portal>
            <View style={styles.inputBoxContainer}>
                <TextInput activeOutlineColor={colors.salmonPink} label="Text" mode="outlined" numberOfLines={5} onChangeText={handleCaptionChange} outlineColor={colors.white} placeholder="Text..." style={styles.captionInput} value={caption} multiline />
            </View>
            <View style={styles.attachmentsSection}>
                <TouchableOpacity onPress={launchPhotoPicker} style={styles.actionIconContainer}>
                    <GeoCitiesPhotoIcon color={colors.white} height={20} width={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleLinkDialog} style={styles.actionIconContainer}>
                    <GeoCitiesLinkIcon color={colors.white} height={20} width={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={launchVideoPicker} style={styles.actionIconContainer}>
                    <GeoCitiesVideoIcon color={colors.white} height={20} width={20} />
                </TouchableOpacity>
            </View>
            <View style={styles.cancelConfirmButtonsContainer}>
                <GeoCitiesButton buttonColor={colors.white} icon="cancel" onPress={handleCancel} text="Cancel" />
                <GeoCitiesButton buttonColor={colors.salmonPink} disabled={isUploadButtonDisabled} icon="upload-network" onPress={uploadPost} text="Upload" />
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
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    let uploadPostType = '';
    const isUploadButtonDisabled = checkBlankInfo();
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError } = useShowDialog();
    
    function handleCancel() {
        navigation.goBack();
    }

    function handleCaptionChange(caption: string) {
        setCaption(caption);
    }

    function handleLinkChange(link: string) {
        setLink(link);
    }

    async function launchPhotoPicker() {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (result.canceled) {
            return;
        }

        setVideoName('');
        setVideoUri(null);

        const localUri = result.assets[0].uri;
        
        const filename = localUri.split('/').pop();

        setPhotoUri(localUri as any);
        setPhotoName(filename as string);
    }

    async function launchVideoPicker() {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 1,
        });

        if (result.canceled) {
            return;
        }

        setPhotoName('');
        setPhotoUri(null);

        const localUri = result.assets[0].uri;
        
        const filename = localUri.split('/').pop();

        setVideoUri(localUri as any);
        setVideoName(filename as string);
    }

    function checkBlankInfo() {
        if (!caption.trim() && !link.trim() && !photoName && !videoName) {
            return true;
        }

        return false;
    }

    async function uploadPost() {
        if (photoName) {
            uploadPostType = 'photo';
        } else if (videoName) {
            uploadPostType = 'video';
        } else if (!photoName && !videoName && link) {
            uploadPostType = 'link';
        } else {
            uploadPostType = 'text';
        }
    }

    function confirmValidLink() {
        if (!link.trim()) {
            setIsLinkDialogOpen(false);
            setIsError(true);
            setDialogTitle('Whoops!');
            setDialogMessage('You must provide a link.');
            handleDialogMessageChange(true);
            setLink('');
            return;
        }
        if (!checkValidUrl(link.trim())) {
            setIsLinkDialogOpen(false);
            setIsError(true);
            setDialogTitle('Whoops!');
            setDialogMessage(`${link} is not a valid url. Please enter a valid url to attach a link.`);
            handleDialogMessageChange(true);
            setLink('');
            return;
        }
        else {
            setIsLinkDialogOpen(false);
            return true;
        }
    }

    function toggleLinkDialog() {
        setLink('');
        setIsLinkDialogOpen(!isLinkDialogOpen);
    }

    return {
        caption,
        confirmValidLink,
        handleCancel,
        handleCaptionChange,
        handleLinkChange,
        isLinkDialogOpen,
        isUploadButtonDisabled,
        launchPhotoPicker,
        launchVideoPicker,
        link,
        toggleLinkDialog,
        uploadPost,
    };
}

const styles = StyleSheet.create({
    actionIconContainer: {
        height: 50,
        width: 50,
    },
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
    },
    linkDialog: {
        borderRadius: 5,
    },
    linkDialogActionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
    },
    linkDialogContentContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
    },
});