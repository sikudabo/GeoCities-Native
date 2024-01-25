import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import Dropdown from 'react-native-paper-dropdown';
import * as ImagePicker from 'expo-image-picker';
import { useQueryClient } from '@tanstack/react-query';
import { HelperText, Surface, TextInput } from 'react-native-paper';
import { useUser } from '../../hooks/storage-hooks';
import { topics } from '../../utils/constants';
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
                    </ScrollView>
                </Surface>
            </View>
        </View>
    );
}

function useDataLayer() {
    const { user } = useUser();
    const { _id } = user;
    const queryClient = useQueryClient();
    const [description, setDescription] = useState('');
    const [groupName, setGroupName] = useState('');
    const [photoName, setPhotoName] = useState('');
    const [photoUri, setPhotoUri] = useState<Blob | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [topic, setTopic] = useState(topics[0]);
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
            allowsEditing: true,
            aspect: [1, 1],
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (result.canceled) {
            return;
        }

        const localUri = result.assets[0].uri;
        
        const filename = localUri.split('/').pop();

        setPhotoUri(localUri as any);
        setPhotoName(filename as string);
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
    topHeader: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
    },
});