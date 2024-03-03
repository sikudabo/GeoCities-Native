import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Dropdown from 'react-native-paper-dropdown';
import { HelperText, TextInput } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { GroupType } from '../../../typings';
import { useShowLoader } from '../../../hooks';
import { topics } from '../../../utils/constants';
import { GeoCitiesBodyText, GeoCitiesButton, GeoCitiesDeleteIcon, colors } from '../../../components';
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
    handleNewRuleChange: (newRule: string) => void;
    handleTopicChange: (topic: string) => void;
    rules?: Array<string>;
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
    handleTopicChange,
    rules,
    setShowDropdown,
    setTopic,
    showDropdown,
    takePicture,
    topic,
}: SettingsTabDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={400}>
                <View style={styles.inputContainer}>
                    <TextInput activeOutlineColor={colors.salmonPink} label="Description" mode="outlined" numberOfLines={5} onChangeText={handleDescriptionChange} onSubmitEditing={() => console.log('We are now submitting')} outlineColor={colors.white} placeholder="Description..." style={styles.captionInput} value={description} blurOnSubmit multiline />
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
                    setValue={handleTopicChange}
                    list={groupTopics}
                />
            </View>
            {typeof rules !== 'undefined' && rules.length > 0 && (
                <View style={styles.rulesSection}>
                    <View style={styles.rulesSectionHeader}>
                        <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={700} text="Rules" />
                    </View>
                    {rules.map((rule, index) => (
                        <View 
                            key={index}
                            style={styles.ruleContainer}
                        >
                            <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight='normal' text={rule} />
                            <TouchableOpacity style={styles.ruleDeleteButtonContainer}>
                                <GeoCitiesDeleteIcon color={colors.error} height={50} width={50} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
            {typeof rules === 'undefined' || rules.length < 10 && (
                <View style={styles.addRuleButtonContainer}>
                    <GeoCitiesButton buttonColor={colors.success} icon="plus"  text="Add Rule" />
                </View>
            )}
            <View style={styles.blockUserButtonContainer}>
                <GeoCitiesButton buttonColor={colors.error} icon="cancel" text="Block" />
            </View>
            <View style={styles.blockUserButtonContainer}>
                <GeoCitiesButton buttonColor={colors.white} icon="camera" text="Avatar" />
            </View>
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
    const [newRule, setNewRule] = useState('');
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

    function handleNewRuleChange(currentRule: string) {
        if (newRule.length >= 75) {
            return;
        }
        setNewRule(currentRule)
    }

    function handleTopicChange(topic: string) {
        setCurrentTopic(topic);
    }
    
    return {
        description: currentDescription,
        groupTopics,
        handleDescriptionChange,
        handleNewRuleChange,
        handleTopicChange,
        rules,
        setTopic: setCurrentTopic,
        setShowDropdown,
        showDropdown,
        takePicture,
        topic: currentTopic,
    };
}

const styles = StyleSheet.create({
    addRuleButtonContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        width: '100%',
    },
    addRuleTitleContainer: {
    },
    addRuleContentContainer: {
        width: '100%',
    },
    blockUserButtonContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
    },
    captionInput: {
        height: 100,
        paddingBottom: 5,
    },
    container: {
        paddingTop: 30,
    },
    dialog: {
        borderRadius: 5,
        height: 400,
        padding: 0,
    },
    inputContainer: {
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    nameHelperText: {
        color: colors.white,
    },
    nameHelperTextDanger: {
        color: colors.error,
    },
    ruleContainer: {
        borderTopColor: colors.white,
        borderStyle: 'solid',
        rowGap: 20,
    },
    ruleDeleteButtonContainer: {
        alignSelf: 'flex-end',
    },
    rulesSection: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
    },
    rulesSectionHeader: {
        alignItems: 'center',
        paddingBottom: 20,
    },
});