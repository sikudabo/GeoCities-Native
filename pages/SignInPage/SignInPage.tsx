import { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { HelperText, Surface, TextInput } from 'react-native-paper';
import { GeoCitiesBodyText, GeoCitiesLogo, colors } from '../../components';

export default function SignInPage() {
    return <SignInPage_DisplayLayer {...useDataLayer()} />;
}

function SignInPage_DisplayLayer() {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <GeoCitiesLogo color={colors.white} height={40} width={40} />
                <Surface elevation={4} style={styles.formContainer}>
                    <View style={styles.inputHolder}>
                        <KeyboardAvoidingView behavior="padding">
                            <TextInput activeOutlineColor={colors.white} label="Email" mode="outlined" left={<TextInput.Icon icon="mail" />} outlineColor={colors.white} placeholder="Email" />
                        </KeyboardAvoidingView>
                        <HelperText type="info">
                            Required* (Valid Email)
                        </HelperText>
                    </View>
                    <View style={styles.inputHolder}>
                        <KeyboardAvoidingView behavior="padding">
                            <TextInput activeOutlineColor={colors.white} label="Password" mode="outlined" left={<TextInput.Icon icon="lock" />} outlineColor={colors.white} placeholder="Password" secureTextEntry />
                        </KeyboardAvoidingView>
                        <HelperText type="info">
                            Required*
                        </HelperText>
                    </View>
                </Surface>
            </View>
        </View>
    );
}

function useDataLayer() {
    return {

    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        width: '100%',
    },
    formContainer: {
        borderRadius: 20,
        height: '75%',
        marginTop: 20,
        paddingBottom: 50,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        width: '100%',
    },
    inputHolder: {
        paddingBottom: 10,
    },
    logoContainer: {
        alignItems: 'center',
        display: 'flex',
        paddingBottom: 50,
        paddingTop: 30,
    },
});