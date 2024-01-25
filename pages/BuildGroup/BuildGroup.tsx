import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { HelperText, Surface, TextInput } from 'react-native-paper';
import { useUser } from '../../hooks/storage-hooks';
import { GeoCitiesBodyText, colors } from '../../components';

type BuildGroupDisplayLayerProps = {
    description: string;
    groupName: string;
    handleDescriptionChange: (description: string) => void;
    handleGroupNameChange: (name: string) => void;
};

export default function BuildGroup() {
    return <BuildGroup_DisplayLayer {...useDataLayer()} />;
}

function BuildGroup_DisplayLayer({
    description,
    groupName,
    handleDescriptionChange,
    handleGroupNameChange,
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
                                <TextInput mode='outlined' onChangeText={handleGroupNameChange} label="Group Name" left={<TextInput.Icon icon="mail" />} outlineColor={colors.white} placeholder="Group Name" activeOutlineColor={colors.white} value={groupName} />
                                <HelperText style={groupName.length <= 50 ? styles.nameHelperText : styles.nameHelperTextDanger} type="info">
                                    Required {`${groupName.length} / 50`}
                                </HelperText>
                            </KeyboardAvoidingView>
                        </View>
                        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={400}>
                            <View style={styles.inputContainer}>
                                <TextInput activeOutlineColor={colors.salmonPink} label="Text" mode="outlined" numberOfLines={5} onChangeText={handleDescriptionChange} outlineColor={colors.white} placeholder="Text..." style={styles.captionInput} value={description} multiline />
                                <HelperText style={description.length <= 300 ? styles.nameHelperText : styles.nameHelperTextDanger} type="info">
                                    Required {`${description.length} / 300`}
                                </HelperText>
                            </View>
                        </KeyboardAvoidingView>
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

    function handleDescriptionChange(description: string) {
        setDescription(description);
    }

    function handleGroupNameChange(name: string) {
        setGroupName(name);
    }

    return {
        description,
        groupName,
        handleDescriptionChange,
        handleGroupNameChange,
    };
}

const styles = StyleSheet.create({
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