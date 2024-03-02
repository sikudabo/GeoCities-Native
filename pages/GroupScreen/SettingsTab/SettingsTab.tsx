import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GroupType } from '../../../typings';
import { GeoCitiesBodyText, GeoCitiesButton, colors } from '../../../components';
import { putBinaryData, putNonBinaryData } from '../../../utils/requests';

type SettingsTabProps = {
    group: GroupType;
};

export default function SettingsTab({ group }: SettingsTabProps) {
    return <SettingsTab_DisplayLayer {...useDataLayer(group)} />;
}

function SettingsTab_DisplayLayer() {
    return (
        <View style={styles.container}>
            <GeoCitiesBodyText color={colors.white} text="Settings" />
        </View>
    );
}

function useDataLayer(group: GroupType) {
    return {

    };
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
    },
});