import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
import GeoCitiesBodyText from './GeoCitiesBodyText';
import GeoCitiesButton from './GeoCitiesButton';
import { colors } from './colors';
import { useShowDialog } from '../hooks';

const width = Dimensions.get('screen').width;

type GeoCitiesDialogDisplayLayerProps = {
    handleDialogClose: () => void;
    isError: boolean;
    isOpen: boolean;
    message: string;
    title: string;
};

export default function GeoCitiesDialog() {
    return <GeoCitiesDialog_DisplayLayer {...useDataLayer()} />;
}

function GeoCitiesDialog_DisplayLayer({
    handleDialogClose,
    isError,
    isOpen,
    message,
    title
}: GeoCitiesDialogDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <Portal>
                <Dialog dismissable={false} style={styles.dialog} visible={isOpen}>
                    <Dialog.Title style={styles.titleContainer}>
                        <GeoCitiesBodyText color={isError ? colors.error : colors.eaglesGreen} fontSize={30} fontWeight='900' text={title} textAlign='center'/>
                    </Dialog.Title>
                    <View style={styles.iconContainer}>
                        <Dialog.Icon color={isError ? colors.error : colors.eaglesGreen} icon={isError ? 'alert-circle' : 'check-circle'} />
                    </View>
                    <Dialog.ScrollArea style={styles.scrollAreaContainer}>
                        <ScrollView>
                            <Dialog.Content style={styles.contentContainer}>
                                <GeoCitiesBodyText fontSize={12} text={message} textAlign="center" />
                            </Dialog.Content>
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <GeoCitiesButton mode="text" onPress={handleDialogClose} text="Close" textColor={isError ? colors.error : colors.eaglesGreen} />
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

function useDataLayer() {
    const { handleDialogMessageChange, isError, isOpen, message, title } = useShowDialog();

    function handleDialogClose() {
        handleDialogMessageChange(false);
    }

    return {
        handleDialogClose,
        isError,
        isOpen,
        message,
        title,
    };
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        display: 'flex',
        justifyContent: 'flex-start',
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
    dialog: {
        backgroundColor: colors.white,
        borderRadius: 5,
    },
    iconContainer: {
        paddingBottom: 10,
    },
    scrollAreaContainer: {
        borderColor: 'rgba(255, 255, 255, 0)',
        height: 100,
        paddingTop: 0,
    },
    titleContainer: {
        textAlign: 'center',
    },
});