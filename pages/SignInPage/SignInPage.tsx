import { useState } from 'react';
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { HelperText, Surface, TextInput } from 'react-native-paper';
import { checkValidEmail } from '../../utils/helpers';
import { postNonBinaryData } from '../../utils/requests';
import { useUser } from '../../hooks/storage-hooks';
import { useShowDialog, useShowLoader } from '../../hooks';
import { GeoCitiesButton, GeoCitiesLogo, colors } from '../../components';

type SignInPageProps = {
    navigation: any;
};

type SignInPageDisplayLayerProps = {
    email: string;
    handleEmailChange: (email: string) => void;
    handlePasswordChange: (password: string) => void;
    handleSignUpNav: () => void;
    handleSubmit: () => void;
    password: string;
};

export default function SignInPage({ navigation }: SignInPageProps) {
    return <SignInPage_DisplayLayer {...useDataLayer({ navigation })} />;
}

function SignInPage_DisplayLayer({
    email,
    handleEmailChange,
    handlePasswordChange,
    handleSignUpNav,
    handleSubmit,
    password,
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
                                    <TextInput activeOutlineColor={colors.white} label="Email" mode="outlined" left={<TextInput.Icon icon="mail" />} onChangeText={handleEmailChange} outlineColor={colors.white} placeholder="Email" value={email} />
                                </KeyboardAvoidingView>
                                <HelperText type="info">
                                    Required* (Valid Email)
                                </HelperText>
                            </View>
                            <View style={styles.inputHolder}>
                                <KeyboardAvoidingView behavior="padding">
                                    <TextInput activeOutlineColor={colors.white} label="Password" mode="outlined" left={<TextInput.Icon icon="lock" />} onChangeText={handlePasswordChange} outlineColor={colors.white} placeholder="Password" value={password} secureTextEntry />
                                </KeyboardAvoidingView>
                                <HelperText type="info">
                                    Required*
                                </HelperText>
                            </View>
                            <View style={styles.loginButtonContainer}>
                                <GeoCitiesButton buttonColor={colors.geoCitiesGreen} text="Login" onPress={handleSubmit} textColor={colors.white} />
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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setIsLoading } = useShowLoader();
    const { setUser } = useUser();
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError } = useShowDialog();

    function handleEmailChange(email: string) {
        setEmail(email);
    }

    function handlePasswordChange(password: string) {
        setPassword(password);
    };

    async function handleSubmit() {
        setIsLoading(true);
        
        if (!checkValidEmail(email)) {
            setIsLoading(false);
            setIsError(true);
            setDialogTitle('Whoops!');
            setDialogMessage('You must enter a valid email!');
            handleDialogMessageChange(true);
            return;
        }

        if (password.length < 6) {
            setIsLoading(false);
            setIsError(true);
            setDialogTitle('Whoops!');
            setDialogMessage('You must enter a valid password!');
            handleDialogMessageChange(true);
            return;
        }

        await postNonBinaryData({
            data: {
                email, 
                password,
                isEmailLogin: true,
            },
            uri: 'login',
        }).then(res => {
            const { isError, message } = res.data;

            if (isError) {
                setIsLoading(false);
                setIsError(true);
                setDialogTitle('Whoops!');
                setDialogMessage(message);
                handleDialogMessageChange(true);
                return;
            }

            const { user } = res.data;
            setIsLoading(false);
            setIsError(false);
            setDialogTitle('Success!');
            setDialogMessage(message);
            handleDialogMessageChange(true);
            const newUser = user;
            newUser.isLoggedIn = true;
            setUser(newUser);
        }).catch(err => {
            console.log('Error logging in a user:', err.message);
            setIsLoading(false);
            setIsError(true);
            setDialogTitle('Whoops!');
            setDialogMessage('There was an error logging you in. Please try again!');
            handleDialogMessageChange(true);
            return;
        });
    }
    function handleSignUpNav() {
        navigation.navigate('SignUp');
    }
    return {
        email,
        handleEmailChange,
        handlePasswordChange,
        handleSignUpNav,
        handleSubmit,
        password,
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