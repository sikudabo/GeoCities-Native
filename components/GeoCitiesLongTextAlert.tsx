import { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
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

    const longText = "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.";

    return (
        <View style={styles.container}>
            <Portal>
                <Dialog dismissable={false} style={{ backgroundColor: colors.white, borderRadius: 5 }} visible={isOpen}>
                    <Dialog.Title>
                        <GeoCitiesBodyText color={colors.error} fontSize={30} fontWeight='900' text="Error" textAlign='center'/>
                    </Dialog.Title>
                    <View style={styles.iconContainer}>
                        <Dialog.Icon color={colors.error} icon="alert-circle" />
                    </View>
                    <Dialog.ScrollArea style={styles.scrollAreaContainer}>
                        <ScrollView>
                            <Dialog.Content style={styles.contentContainer}>
                                <GeoCitiesBodyText fontSize={12} text={longText} textAlign="left" />
                            </Dialog.Content>
                        </ScrollView>
                    </Dialog.ScrollArea>
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
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 200,
        width: width,
    },
    contentContainer: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 30,
    },
    iconContainer: {
        paddingBottom: 10,
    },
    portal: {
        padding: 0,
    },
    scrollAreaContainer: {
        borderColor: 'rgba(255, 255, 255, 0)',
        height: 100,
        paddingTop: 0,
    }
});