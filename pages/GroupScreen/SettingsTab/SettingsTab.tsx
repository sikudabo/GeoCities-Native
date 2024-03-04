import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Dropdown from 'react-native-paper-dropdown';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { HelperText, TextInput } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { topics } from '../../../utils/constants';
import { GroupType, UserType } from '../../../typings';
import { GeoCitiesAvatar, GeoCitiesBodyText, GeoCitiesButton, GeoCitiesDeleteIcon, colors } from '../../../components';
import { postNonBinaryData, putNonBinaryData } from '../../../utils/requests';
import { useShowDialog, useShowLoader } from '../../../hooks';


type SettingsTabProps = {
    blockedUsers: Array<UserType>;
    group: GroupType;
};

type SettingsTabDisplayLayerProps = Pick<SettingsTabProps, 'blockedUsers'> & {
    description: string;
    groupTopics: {
        label: string;
        value: string;
    }[];
    handleBlockUsersClick: () => void;
    handleDeleteRule: (rule: string) => void;
    handleDescriptionChange: (newDescription: string) => void;
    handleNewRuleClick: () => void;
    handleSubmit: (newTopic?: string) => void;
    handleTopicChange: (topic: string) => void;
    rules?: Array<string>;
    setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
    showDropdown: boolean;
    setTopic: React.Dispatch<React.SetStateAction<string>>;
    takePicture: () => void;
    topic: string;
};

export default function SettingsTab({ blockedUsers, group }: SettingsTabProps) {
    return <SettingsTab_DisplayLayer blockedUsers={blockedUsers} {...useDataLayer(group)} />;
}

function SettingsTab_DisplayLayer({
    blockedUsers,
    description,
    groupTopics,
    handleBlockUsersClick,
    handleDeleteRule,
    handleDescriptionChange,
    handleNewRuleClick,
    handleSubmit,
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
                    <TextInput activeOutlineColor={colors.salmonPink} label="Description" mode="outlined" numberOfLines={5} onChangeText={handleDescriptionChange} onSubmitEditing={() => handleSubmit()} outlineColor={colors.white} placeholder="Description..." returnKeyType="done" style={styles.captionInput} value={description} blurOnSubmit multiline />
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
                    setValue={(val: string) => handleSubmit(val)}
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
                            <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight='normal' text={`${index + 1}. ${rule}`} />
                            <TouchableOpacity onPress={() => handleDeleteRule(rule)} style={styles.ruleDeleteButtonContainer}>
                                <GeoCitiesDeleteIcon color={colors.error} height={25}  width={25} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
            {typeof rules === 'undefined' || rules.length < 10 && (
                <View style={styles.addRuleButtonContainer}>
                    <GeoCitiesButton buttonColor={colors.success} icon="plus" onPress={handleNewRuleClick}  text="Add Rule" />
                </View>
            )}
            <View style={styles.blockUserButtonContainer}>
                <GeoCitiesButton buttonColor={colors.error} icon="cancel" onPress={handleBlockUsersClick} text="Block" />
            </View>
            {typeof blockedUsers !== 'undefined' && blockedUsers.length > 0 && (
                <View style={styles.blockedUsersListSection}>
                    <View style={styles.blockedUsersTitleContainer}>
                        <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="Blocked Users" />
                    </View>
                    {blockedUsers.map((user, index) => (
                        <View
                            key={index}
                            style={styles.userContainer}
                        >
                            <View>
                                <GeoCitiesAvatar size={50} src={`${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${user.avatar}`} />
                            </View>
                            <View style={styles.userNameContainer}>
                                <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight='normal' text={`${user.firstName} ${user.lastName}`} />
                            </View>
                            <View style={styles.unBlockButtonContainer}>
                                <GeoCitiesButton buttonColor={colors.salmonPink} mode="outlined" text="Unblock" />
                            </View>
                        </View>
                    ))}
                </View>
            )}
            <View style={styles.blockUserButtonContainer}>
                <GeoCitiesButton buttonColor={colors.white} icon="camera" text="Avatar" />
            </View>
        </View>
    );
}

function useDataLayer(group: GroupType) {
    const queryClient = useQueryClient();
    const { setIsLoading } = useShowLoader();
    const { avatar, blockList, description, groupName, rules, topic } = group;
    const [currentAvatar, setCurrentAvatar] = useState<any>();
    const [uri, setUri] = useState<Blob | null>(null);
    const [name, setName] = useState('');
    const [currentDescription, setCurrentDescription] = useState(description);
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentTopic, setCurrentTopic] = useState(topic);
    const navigation: any = useNavigation();
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError } = useShowDialog();
    let groupTopics: Array<{label: string; value: string;}> = [];
    topics.forEach((topic) => {
        groupTopics.push({ label: topic, value: topic });
    });

    async function handleSubmit(newTopic?: string) {
        setShowDropdown(false);
        setIsLoading(true);
        if (!currentDescription.trim()) {
            setIsLoading(false);
            setDialogMessage('You must enter a group description!');
            setDialogTitle('Uh Oh!');
            setIsError(true);
            handleDialogMessageChange(true);
            return;
        }

        if (currentDescription.length > 300) {
            setIsLoading(false);
            setDialogMessage('The group description must be 300 characters or less.');
            setDialogTitle('Uh Oh!');
            setIsError(true);
            handleDialogMessageChange(true);
            return;
        }

        if (newTopic) {
            setCurrentTopic(newTopic);
        }

        await postNonBinaryData({
            data: {
                blockList,
                description: currentDescription,
                groupName,
                rules,
                topic: typeof newTopic !== 'undefined' ? newTopic : currentTopic,
            },
            uri: 'update-group',
        }).then(res => {
            const { isSuccess, message } = res;

            if (isSuccess) {
                queryClient.invalidateQueries(['fetchGroup']);
                setDialogMessage(message);
                setDialogTitle('Success!');
                setIsError(false);
                setIsLoading(false);
                handleDialogMessageChange(true);
            } else {
                setDialogMessage('There was an error updating this group. Please try again!');
                setDialogTitle('Uh Oh!');
                setIsError(true);
                setIsLoading(false);
                handleDialogMessageChange(true);
                return;
            }
        }).catch(err => {
            console.log(`There was an error updating a group: ${err.message}`);
            setDialogMessage('There was an error deleting that rule. Please try again!');
            setDialogTitle('Uh Oh!');
            setIsError(true);
            setIsLoading(false);
            handleDialogMessageChange(true);
            return;
        });
    }

    async function handleDescriptionChange(newDescription: string) {
        setCurrentDescription(newDescription);
    }

    async function handleDeleteRule(rule: string) {
        setIsLoading(true);
        const currentRules = rules?.filter(ruleIt => ruleIt !== rule);

        await postNonBinaryData({
            data: {
                blockList,
                description,
                groupName,
                rules: currentRules,
                topic,
            },
            uri: 'update-group',
        }).then(res => {
            const { isSuccess, message } = res;

            if (isSuccess) {
                queryClient.invalidateQueries(['fetchGroup']);
                setDialogMessage(message);
                setDialogTitle('Success!');
                setIsError(false);
                setIsLoading(false);
                handleDialogMessageChange(true);
                return;
            } else {
                setDialogMessage('There was an error deleting that rule. Please try again!');
                setDialogTitle('Uh Oh!');
                setIsError(true);
                setIsLoading(false);
                handleDialogMessageChange(true);
                return;
            }
        }).catch(err => {
            console.log(`There was an error removing a rule from a group: ${err.message}`);
            setDialogMessage('There was an error deleting that rule. Please try again!');
            setDialogTitle('Uh Oh!');
            setIsError(true);
            setIsLoading(false);
            handleDialogMessageChange(true);
            return;
        });
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
            console.log('There was an error changing the group avatar:', e.message);
        });   
    }

    async function handleTopicChange(topic: string) {
        setCurrentTopic(topic);
        await handleSubmit();
        return;
    }

    function handleNewRuleClick() {
        const group = {
            blockList,
            description: currentDescription,
            topic: currentTopic,
            groupName,
            rules,
        };

        navigation.navigate('NewRulesScreen', { group });
        return;
    }

    function handleBlockUsersClick() {
        const group = {
            blockList,
            description: currentDescription,
            topic: currentTopic,
            groupName,
            rules,
        };

        navigation.navigate('BlockUsersScreen', { group });
        return;
    }
    
    return {
        description: currentDescription,
        groupTopics,
        handleBlockUsersClick,
        handleDeleteRule,
        handleDescriptionChange,
        handleNewRuleClick,
        handleSubmit,
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
    blockedUsersListSection: {
        paddingTop: 20,
    },
    blockedUsersTitleContainer: {
        alignItems: 'center',
        paddingBottom: 30,
        width: '100%',
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
        borderColor: colors.white,
        borderStyle: 'solid',
        borderWidth: 1,
        paddingBottom: 20,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        rowGap: 10,
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
    unBlockButtonContainer: {
        marginLeft: 'auto',
    },
    userContainer: {
        columnGap: 20,
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },
    userNameContainer: {
        paddingTop: 10,
    }
});