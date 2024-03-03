import { useState } from 'react';
import { StyleSheet, View } from "react-native";
import { useQueryClient } from '@tanstack/react-query';
import { HelperText, TextInput } from "react-native-paper";
import { postNonBinaryData } from "../../../../utils/requests";
import { GroupType } from '../../../../typings';
import { useShowDialog, useShowLoader } from '../../../../hooks';
import { GeoCitiesBodyText, GeoCitiesButton, colors } from '../../../../components';

type NewRuleScreenProps = {
    navigation: any;
    route: any;
};

type DataLayerProps = {
    group: GroupType;
    navigation: any;
};

type NewRuleDisplayLayerProps = {
    goBackToSettings: () => void;
    handleNewRuleUpdate: (newRule: string) => void;
    handleSubmit: () => void;
    newRule: string;
};

export default function NewRulesScreen({
    navigation,
    route,
}: NewRuleScreenProps) {
    const { group } = route.params;
    return <NewRulesScreen_DisplayLayer {...useDataLayer({ group, navigation })} />;
}

function NewRulesScreen_DisplayLayer({
    goBackToSettings,
    handleNewRuleUpdate,
    handleSubmit,
    newRule,
}: NewRuleDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.headerTitleContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="Add Rule" />
            </View>
            <View style={styles.inputContainer}>
                <TextInput mode='outlined' onChangeText={handleNewRuleUpdate} label="Rule" maxLength={75}  outlineColor={colors.white} placeholder="Rule..." activeOutlineColor={colors.salmonPink} returnKeyType="done" style={styles.inputStyle} value={newRule} />
                <HelperText type="info">
                    Required {`${newRule.length} / 75`}
                </HelperText>
            </View>
            <View style={styles.cancelConfirmButtonsContainer}>
                <GeoCitiesButton buttonColor={colors.white} icon="cancel" onPress={goBackToSettings} text="Cancel" />
                <GeoCitiesButton buttonColor={colors.salmonPink} icon="plus" onPress={handleSubmit} text="Add Rule" />
            </View>
        </View>
    );
}


function useDataLayer({ group, navigation }: DataLayerProps) {
    const queryClient = useQueryClient();
    const [newRule, setNewRule] = useState('');
    const { blockList, description, groupName, rules, topic } = group;
    const { setIsLoading } = useShowLoader();
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError } = useShowDialog();

    function handleNewRuleUpdate(newRule: string) {
        setNewRule(newRule);
    }

    async function handleSubmit() {
        setIsLoading(true);

        if (!newRule.trim()) {
            setDialogMessage('You must enter a rule.');
            setDialogTitle('Uh Oh!');
            setIsError(true);
            handleDialogMessageChange(true);
            setIsLoading(false);
            return;
        }

        const newRules = typeof rules !== 'undefined' ? [...rules, newRule] : [newRule];

        await postNonBinaryData({
            data: {
                blockList,
                description,
                groupName,
                rules: newRules,
                topic,
            },
            uri: 'update-group',
        }).then(res => {
            const { isSuccess, message } = res;
            if (isSuccess) {
                setDialogMessage(message);
                setDialogTitle('Success!');
                setIsError(false);
                handleDialogMessageChange(true);
                setIsLoading(false);
                queryClient.invalidateQueries(['fetchGroup']);
                navigation.navigate('GroupScreen', { group: { groupName }, settingsIndex: true });
                return;
            } else {
                setDialogMessage(`There was an error updating ${groupName}. Please try again!`);
                setDialogTitle('Uh Oh');
                setIsError(true)
                handleDialogMessageChange(true);
                setIsLoading(false);
                return;
            }
        }).catch(err => {
            console.log('There was an error adding a rule for a group:', err.message);
            setDialogMessage(`There was an error updating ${groupName}. Please try again!`);
            setDialogTitle('Uh Oh');
            setIsError(true)
            handleDialogMessageChange(true);
            setIsLoading(false);
            return;
        });
    }
    
    function goBackToSettings() {
        navigation.navigate('GroupScreen', { group: { groupName }, settingsIndex: true });
    }

    return {
        goBackToSettings,
        handleNewRuleUpdate,
        handleSubmit,
        newRule,
    };
}

const styles = StyleSheet.create({
    cancelConfirmButtonsContainer: {
        columnGap: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
    },
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        paddingTop: 20,
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    inputContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        width: '100%',
    },
    inputStyle: {
        paddingLeft: 10,
        paddingRight: 10,
        flexWrap: 'nowrap',
    }
});

