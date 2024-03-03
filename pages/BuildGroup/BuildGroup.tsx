import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import Dropdown from 'react-native-paper-dropdown';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { GenericFormData } from 'axios';
import { HelperText, Surface, TextInput } from 'react-native-paper';
import { putBinaryData } from '../../utils/requests';
import { useUser } from '../../hooks/storage-hooks';
import { topics } from '../../utils/constants';
import { useShowDialog, useShowLoader } from '../../hooks';
import { GeoCitiesButton, GeoCitiesBodyText, colors } from '../../components';

type BuildGroupDisplayLayerProps = {
    description: string;
    groupName: string;
    groupTopics: {
        label: string;
        value: string;
    }[];
    handleDescriptionChange: (description: string) => void;
    handleGroupNameChange: (name: string) => void;
    handleSelectAvatar: () => void;
    setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
    setTopic: React.Dispatch<React.SetStateAction<string>>;
    showDropdown: boolean;
    submitGroup: () => void;
    topic: string;
};

export default function BuildGroup() {
    return <BuildGroup_DisplayLayer {...useDataLayer()} />;
}

function BuildGroup_DisplayLayer({
    description,
    groupName,
    groupTopics,
    handleDescriptionChange,
    handleGroupNameChange,
    handleSelectAvatar,
    setShowDropdown,
    setTopic,
    showDropdown,
    submitGroup,
    topic,
}: BuildGroupDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.topHeader}>
                <GeoCitiesBodyText color={colors.white} fontSize={32} text='Create Group' />
            </View>
            <View style={styles.formContainer}>
                <Surface elevation={4} style={styles.form}>
                    <ScrollView>
                        <View style={styles.inputContainer}>
                            <KeyboardAvoidingView behavior="position" style={styles.keyboardContainer}>
                                <TextInput mode='outlined' onChangeText={handleGroupNameChange} label="Group Name" left={<TextInput.Icon icon="spellcheck" />} outlineColor={colors.white} placeholder="Group Name" activeOutlineColor={colors.salmonPink} value={groupName} />
                                <HelperText style={groupName.length <= 50 ? styles.nameHelperText : styles.nameHelperTextDanger} type="info">
                                    Required {`${groupName.length} / 50`}
                                </HelperText>
                            </KeyboardAvoidingView>
                        </View>
                        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
                            <View style={styles.inputContainer}>
                                <TextInput activeOutlineColor={colors.salmonPink} label="Description" mode="outlined" numberOfLines={5} onChangeText={handleDescriptionChange} outlineColor={colors.white} placeholder="Description..." style={styles.captionInput} value={description} multiline />
                                <HelperText style={description.length <= 300 ? styles.nameHelperText : styles.nameHelperTextDanger} type="info">
                                    Required {`${description.length} / 300`}
                                </HelperText>
                            </View>
                        </KeyboardAvoidingView>
                        <View style={styles.inputContainer}>
                            <Dropdown
                                activeColor={colors.salmonPink}
                                dropDownItemTextStyle={{
                                    color: colors.white,
                                }}
                                dropDownItemSelectedTextStyle={{
                                    color: colors.salmonPink,
                                }}
                                label="Topic"
                                mode="outlined"
                                visible={showDropdown}
                                showDropDown={() => setShowDropdown(true)}
                                onDismiss={() => setShowDropdown(false)}
                                value={topic}
                                setValue={setTopic}
                                list={groupTopics}
                            />
                        </View>
                        <View style={styles.avatarButtonContainer}>
                            <GeoCitiesButton buttonColor={colors.salmonPink} icon="image-album" onPress={handleSelectAvatar} text="Avatar" />
                        </View>
                        <View style={styles.submitButtonSection}>
                            <GeoCitiesButton buttonColor={colors.salmonPink} icon="cog" mode="outlined" onPress={submitGroup} text="Build" />
                        </View>
                    </ScrollView>
                </Surface>
            </View>
        </View>
    );
}

function useDataLayer() {
    const navigation: any = useNavigation();
    const { user } = useUser();
    const { _id } = user;
    const [description, setDescription] = useState('');
    const [groupName, setGroupName] = useState('');
    const [avatar, setAvatar] = useState<any>();
    const [photoName, setPhotoName] = useState('');
    const [photoUri, setPhotoUri] = useState<Blob | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [topic, setTopic] = useState(topics[0]);
    const { setIsLoading } = useShowLoader();
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError } = useShowDialog();
    
    let groupTopics: Array<{label: string; value: string;}> = [];
    topics.forEach((topic) => {
        groupTopics.push({ label: topic, value: topic });
    });

    function handleDescriptionChange(description: string) {
        setDescription(description);
    }

    function handleGroupNameChange(name: string) {
        setGroupName(name);
    }

    async function handleSelectAvatar() {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (result.canceled) {
            return;
        }

        const localUri = result.assets[0].uri;
        
        const filename = localUri.split('/').pop();

        setAvatar(result as any);
        setPhotoUri(localUri as any);
        setPhotoName(filename as string);
    }

    async function submitGroup() {
        setIsLoading(true);

        if (!groupName.trim()) {
            setIsLoading(false);
            setIsError(true);
            setDialogTitle('Uh Oh');
            setDialogMessage('Please add a name for this group!');
            handleDialogMessageChange(true);
            return;
        }

        if (!description.trim()) {
            setIsLoading(false);
            setIsError(true);
            setDialogTitle('Uh Oh');
            setDialogMessage('Please add a description for this group!');
            handleDialogMessageChange(true);
            return;
        }

        if (description.length > 300) {
            setIsLoading(false);
            setIsError(true);
            setDialogTitle('Uh Oh');
            setDialogMessage('Please shorten the group description to 300 characters or less.');
            handleDialogMessageChange(true);
            return;
        }

        if (!avatar || !photoName || !photoUri) {
            setIsLoading(false);
            setIsError(true);
            setDialogTitle('Uh Oh');
            setDialogMessage('Please add an avatar for this group!');
            handleDialogMessageChange(true);
            return;
        }

        let fd: GenericFormData = new FormData();
        const createdAt = new Date().getTime();
        fd.append('createdAt', createdAt);
        fd.append('creator', _id);
        fd.append('description', description);
        fd.append('groupName', groupName.trim());
        fd.append('topic', topic);
        fd.append('avatar', { name: photoName, uri: photoUri, type: 'image' })

        await putBinaryData({
            data: fd,
            uri: 'create-group',
        }).then(res => {
            const { group, isError, message } = res;
            
            setIsLoading(false);
            setIsError(isError ? true : false);
            setDialogTitle(isError ? 'Uh Oh!' : 'Success!');
            setDialogMessage(message);
            handleDialogMessageChange(true);

            if (!isError) {
                navigation.navigate('GroupScreen', { group });
            }
            return;
        }).catch(err => {
            console.log('Error creating a new GeoGroup:', err.message);
            setIsLoading(false);
            setIsError(true);
            setDialogTitle('Uh Oh!');
            setDialogMessage('There was an error creating that group. Please try again!');
            handleDialogMessageChange(true);
            return;
        });
    }

    return {
        description,
        groupName,
        groupTopics,
        handleDescriptionChange,
        handleGroupNameChange,
        handleSelectAvatar,
        setShowDropdown,
        setTopic,
        showDropdown,
        submitGroup,
        topic,
    };
}

const styles = StyleSheet.create({
    avatarButtonContainer: {
        paddingTop: 20,
    },
    captionInput: {
        height: 100,
        paddingBottom: 5,
    },
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        paddingTop: 50,
        width: '100%',
    },
    form: {
        borderRadius: 20,
        height: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
    },
    formContainer: {
        height: '100%',
        paddingBottom: 100,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 30,
    },
    inputContainer: {
        paddingBottom: 10,
    },
    keyboardContainer: {
        flex: 1,
    },
    nameHelperText: {
        color: colors.white,
    },
    nameHelperTextDanger: {
        color: colors.error,
    },
    submitButtonSection: {
        paddingTop: 30,
    },
    topHeader: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
    },
});