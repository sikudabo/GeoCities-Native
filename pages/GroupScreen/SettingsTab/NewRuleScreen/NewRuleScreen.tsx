import { useState } from 'react';
import { StyleSheet, View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { postNonBinaryData } from "../../../../utils/requests";
import { GroupType } from '../../../../typings';
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
    newRule,
}: NewRuleDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.headerTitleContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="Add Rule" />
            </View>
            <View style={styles.inputContainer}>
                <TextInput mode='outlined' onChangeText={handleNewRuleUpdate} label="Rule" maxLength={75}  outlineColor={colors.white} placeholder="Rule..." activeOutlineColor={colors.white} returnKeyType="done" style={styles.inputStyle} value={newRule} />
                <HelperText type="info">
                    Required {`${newRule.length} / 75`}
                </HelperText>
            </View>
            <View style={styles.cancelConfirmButtonsContainer}>
                <GeoCitiesButton buttonColor={colors.white} icon="cancel" onPress={goBackToSettings} text="Cancel" />
                <GeoCitiesButton buttonColor={colors.salmonPink} icon="plus" onPress={() => console.log('Sending')} text="Add Rule" />
            </View>
        </View>
    );
}


function useDataLayer({ group, navigation }: DataLayerProps) {
    const [newRule, setNewRule] = useState('');
    const { groupName } = group;

    function handleNewRuleUpdate(newRule: string) {
        setNewRule(newRule);
    }
    
    function goBackToSettings() {
        navigation.navigate('GroupScreen', { group: { groupName }, settingsIndex: true });
    }

    return {
        goBackToSettings,
        handleNewRuleUpdate,
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

