import { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Dialog, Portal, TextInput } from 'react-native-paper';
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
    link: string;
    toggleLinkDialog: () => void;
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
    link,
    toggleLinkDialog,
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
                <TouchableOpacity style={styles.actionIconContainer}>
                    <GeoCitiesPhotoIcon color={colors.white} height={20} width={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleLinkDialog} style={styles.actionIconContainer}>
                    <GeoCitiesLinkIcon color={colors.white} height={20} width={20} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionIconContainer}>
                    <GeoCitiesVideoIcon color={colors.white} height={20} width={20} />
                </TouchableOpacity>
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
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
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

    function checkBlankInfo() {
        if (!caption.trim() && !link.trim() && !photoName && !videoName) {
            return true;
        }

        return false;
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
        if (!checkValidUrl(link)) {
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
        link,
        toggleLinkDialog,
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