import { useState } from 'react';
import { Dimensions,StyleSheet, View } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
import GeoCitiesBodyText from './GeoCitiesBodyText';
import GeoCitiesButton from './GeoCitiesButton';
import { colors } from './colors';

type GeoCitiesLongTextAlertProps = {
    handleClose: () => void;
    isOpen: boolean;
}

const width = Dimensions.get('screen').width;

export default function GeoCitiesLongTextAlert({
    handleClose,
    isOpen,
}: GeoCitiesLongTextAlertProps) {
    function handleDialogDismiss() {
        return false;
    }
    return (
        <View style={styles.container}>
            <Portal>
            <Dialog dismissable={false} style={{ backgroundColor: colors.white, borderRadius: 5 }} visible={isOpen}>
            <Dialog.Title>
                <GeoCitiesBodyText color={colors.error} fontSize={30} fontWeight='900' text="Error" textAlign='center'/>
            </Dialog.Title>
            <Dialog.Icon color={colors.error} icon="alert-circle" />
            <Dialog.Content style={styles.contentContainer}>
                <GeoCitiesBodyText fontSize={12} text="You must enter a username!" textAlign="center" />
            </Dialog.Content>
            <Dialog.Actions>
                <GeoCitiesButton mode="text" onPress={handleClose} text="Close" textColor={colors.error} />
            </Dialog.Actions>
        </Dialog>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 200,
        width: width,
    },
    contentContainer: {
        paddingTop: 30,
    },
});