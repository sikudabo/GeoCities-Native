import { useState } from 'react';
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { HelperText, Surface, TextInput } from 'react-native-paper';
import { GeoCitiesButton, GeoCitiesBodyText, GeoCitiesLogo, colors } from '../../components';

type SignInPageProps = {
    navigation: any;
};

type SignInPageDisplayLayerProps = {
    handleSignUpNav: () => void;
};

export default function SignInPage({ navigation }: SignInPageProps) {
    return <SignInPage_DisplayLayer {...useDataLayer({ navigation })} />;
}

function SignInPage_DisplayLayer({
    handleSignUpNav
}: SignInPageDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <GeoCitiesLogo color={colors.white} height={40} width={40} />
                <Surface elevation={4} style={styles.formContainer}>
                    <SafeAreaView>
                        <ScrollView>
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
                            <View style={styles.loginButtonContainer}>
                                <GeoCitiesButton buttonColor={colors.geoCitiesGreen} text="Login" textColor={colors.white} />
                            </View>
                            <View style={styles.loginButtonContainer}>
                                <GeoCitiesButton buttonColor={colors.fbBlue} icon="facebook" text="Login With Facebook" textColor={colors.white} />
                            </View>
                            <View style={styles.loginButtonContainer}>
                                <GeoCitiesButton buttonColor={colors.geoCitiesBlue} onPress={handleSignUpNav} text="Sign Up" textColor={colors.white} />
                            </View>
                            <View>
                                <GeoCitiesButton buttonColor={colors.error} text="Forgot?" textColor={colors.white} />
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </Surface>
            </View>
        </View>
    );
}

function useDataLayer({ navigation }: SignInPageProps) {

    function handleSignUpNav() {
        navigation.navigate('SignUp');
    }
    return {
        handleSignUpNav,
    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        paddingLeft: 10,
        paddingRight: 10,
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
    loginButtonContainer: {
        paddingBottom: 20,
    },
    logoContainer: {
        alignItems: 'center',
        display: 'flex',
        paddingBottom: 50,
        paddingTop: 30,
    },
});