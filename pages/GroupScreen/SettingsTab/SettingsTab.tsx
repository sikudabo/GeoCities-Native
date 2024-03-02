import { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import Dropdown from 'react-native-paper-dropdown';
import { HelperText, TextInput } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { GroupType } from '../../../typings';
import { useShowLoader } from '../../../hooks';
import { topics } from '../../../utils/constants';
import { GeoCitiesBodyText, GeoCitiesButton, colors } from '../../../components';
import { putBinaryData, putNonBinaryData } from '../../../utils/requests';

type SettingsTabProps = {
    group: GroupType;
};

type SettingsTabDisplayLayerProps = {
    description: string;
    groupTopics: {
        label: string;
        value: string;
    }[];
    handleDescriptionChange: (description: string) => void;
    setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
    showDropdown: boolean;
    setTopic: React.Dispatch<React.SetStateAction<string>>;
    takePicture: () => void;
    topic: string;
};

export default function SettingsTab({ group }: SettingsTabProps) {
    return <SettingsTab_DisplayLayer {...useDataLayer(group)} />;
}

function SettingsTab_DisplayLayer({
    description,
    groupTopics,
    handleDescriptionChange,
    setShowDropdown,
    setTopic,
    showDropdown,
    takePicture,
    topic,
}: SettingsTabDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={700}>
                <View style={styles.inputContainer}>
                    <TextInput activeOutlineColor={colors.salmonPink} label="Description" mode="outlined" numberOfLines={5} onChangeText={handleDescriptionChange} outlineColor={colors.white} placeholder="Description..." style={styles.captionInput} value={description} multiline />
                    <HelperText style={description.length <= 300 ? styles.nameHelperText : styles.nameHelperTextDanger} type="info">
                        Required {`${description.length} / 300`}
                    </HelperText>
                </View>
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
            </KeyboardAvoidingView>
        </View>
    );
}

function useDataLayer(group: GroupType) {
    const { setIsLoading } = useShowLoader();
    const { avatar, blockList, description, groupName, rules, topic } = group;
    const [currentAvatar, setCurrentAvatar] = useState<any>();
    const [uri, setUri] = useState<Blob | null>(null);
    const [name, setName] = useState('');
    const [currentDescription, setCurrentDescription] = useState(description);
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentTopic, setCurrentTopic] = useState(topic);
    let groupTopics: Array<{label: string; value: string;}> = [];
    topics.forEach((topic) => {
        groupTopics.push({ label: topic, value: topic });
    });

    function handleDescriptionChange(description: string) {
        setCurrentDescription(description);
    }

    async function takePicture() {
        setIsLoading(true);
        await ImagePicker.requestCameraPermissionsAsync();
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (result.canceled) {
            setIsLoading(false);
            return;
        }

        const localUri = result.assets[0].uri;
        
        const filename = localUri.split('/').pop();

        setUri(localUri as any);
        setName(filename as string);
        const fd = new FormData();
        await FileSystem.uploadAsync(`${process.env.EXPO_PUBLIC_API_BASE_URI}/update-group-avatar/:${groupName}`, localUri, {
            fieldName: 'avatar',
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        }).then((response: any) => {
            setIsLoading(false);
        }).catch(e => {
            setIsLoading(false);
            console.log('THere was an error changing the group avatar:', e.message);
        });   
    }
    
    return {
        description: currentDescription,
        groupTopics,
        handleDescriptionChange,
        setTopic: setCurrentTopic,
        setShowDropdown,
        showDropdown,
        takePicture,
        topic: currentTopic,
    };
}

const styles = StyleSheet.create({
    captionInput: {
        height: 100,
        paddingBottom: 5,
    },
    container: {
        paddingTop: 30,
    },
    inputContainer: {
        paddingBottom: 10,
    },
    nameHelperText: {
        color: colors.white,
    },
    nameHelperTextDanger: {
        color: colors.error,
    },
});