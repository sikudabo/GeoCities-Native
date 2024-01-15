import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import axios from 'axios';
import Dropdown from 'react-native-paper-dropdown';
import * as AuthSession from 'expo-auth-session';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as ImagePicker from 'expo-image-picker';
import { HelperText, Surface, TextInput } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { states } from '../../utils/constants';
import { useShowDialog } from '../../hooks';
import { checkValidEmail } from '../../utils/helpers';
import { GeoCitiesBodyText, GeoCitiesButton, GeoCitiesLogo, colors } from '../../components';

type StateObjectType = {
    label: string;
    value: string;
}

let statesList: StateObjectType[] = []

states.forEach(state => {
    statesList.push({ label: state, value: state });
});

export default function SignUpPage() {
    const [pickerIsOpen, setPickerIsOpen] = useState(false);
    const [birthday, setBirthday] = useState(new Date(2023, 2, 21));
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [locationState, setLocationState] = useState(states[0]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatar, setAvatar] = useState<any>();
    const [uri, setUri] = useState<Blob | null>(null);
    const [fileName, setFileName] = useState('');
    const redirectUri = AuthSession.makeRedirectUri();
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError } = useShowDialog();
    const [__, _, fbPromptAsync] = Facebook.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_API_FB_CODE,
        redirectUri: `fb${process.env.EXPO_PUBLIC_API_FB_CODE}://authorize`,
    });

    function handleBirthdayChange(event: DateTimePickerEvent, date: any) {
        const newDate = new Date(date);
        setBirthday(newDate);
    }

    function handleEmailChange(email: string) {
        setEmail(email);
    }

    function handlePasswordChange(password: string) {
        setPassword(password);
    }

    function handleCityChange(city: string) {
        setCity(city);
    }

    async function takePicture() {
        await ImagePicker.requestCameraPermissionsAsync();
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            aspect: [16, 9],
            cameraType: ImagePicker.CameraType.front,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (result.canceled) {
            return;
        }

        const localUri = result.assets[0].uri;
        
        const filename = localUri.split('/').pop();

        setAvatar(result as any);
        setUri(localUri as any);
        setFileName(filename as string);
    }

    async function facebookConfirmation() {

        const response = await fbPromptAsync();
        
        if (response.type === 'success') {
            console.log(response?.authentication?.accessToken)
            const { accessToken } = response?.authentication ? response.authentication : { accessToken: '' };
            if (accessToken) {
                await axios({
                    method: 'GET',
                    url: `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
                }).then(res => {
                    const { name } = res.data;
                    setFirstName(name.split(' ')[0]);
                    setLastName(name.split(' ')[1]);
                }).catch(err => {
                    console.log('There was an error:', err.message);
                });
            }
        }
    }

    function handleSubmit() {
        if (!checkValidEmail(email)) {
            setIsError(true);
            setDialogTitle('Whoops!');
            setDialogMessage('You must enter a valid email address.');
            handleDialogMessageChange(true);
            return;
        }

        if (password.length < 6) {
            setIsError(true);
            setDialogTitle('Whoops!');
            setDialogMessage('You must enter a password that is at least 6 characters long.');
            handleDialogMessageChange(true);
            return;
        }

        if (!city) {
            setIsError(true);
            setDialogTitle('Whoops!');
            setDialogMessage('You must enter the city you currently live in.');
            handleDialogMessageChange(true);
            return;
        }
    }

    return (
        <View style={styles.loginContainer}>
            <GeoCitiesBodyText color={colors.white} text="Sign Up" fontSize={30} fontWeight={900} />
            <View style={styles.logoContainer}>
                <GeoCitiesLogo color={colors.white} height={40} width={40} />
            </View>
            <Surface elevation={4} style={styles.formContainer}>
                <ScrollView>
                    <View style={styles.inputHolder}>
                        <KeyboardAvoidingView behavior="position" style={styles.keyboardContainer}>
                            <TextInput mode='outlined' onChangeText={handleEmailChange} label="Email" left={<TextInput.Icon icon="mail" />} outlineColor={colors.white} placeholder="Email" activeOutlineColor={colors.white} value={email} />
                            <HelperText type="info">
                                Required 
                            </HelperText>
                        </KeyboardAvoidingView>
                    </View>
                    <View style={styles.inputHolder}>
                        <KeyboardAvoidingView behavior="padding" style={styles.keyboardContainer}>
                            <TextInput mode='outlined' onChangeText={handlePasswordChange} label="Password" left={<TextInput.Icon icon="lock" />} outlineColor={colors.white} placeholder="Password" activeOutlineColor={colors.white} value={password} secureTextEntry />
                            <HelperText type="info">
                                Required (At least 6 characters)
                            </HelperText>
                        </KeyboardAvoidingView>
                    </View>
                    <KeyboardAvoidingView behavior="position" style={styles.keyboardContainer}>
                        <View style={styles.inputHolder}>
                            <TextInput mode='outlined' label="City" left={<TextInput.Icon icon="city" />} outlineColor={colors.white} onChangeText={handleCityChange} placeholder="City" activeOutlineColor={colors.white} value={city} />
                            <HelperText type="info">
                                Required 
                            </HelperText>
                        </View>
                    </KeyboardAvoidingView>
                    <View style={styles.inputHolder}>
                        <Dropdown
                            dropDownItemTextStyle={{
                                color: colors.white,
                            }}
                            dropDownItemSelectedTextStyle={{
                                color: colors.geoCitiesGreen,
                            }}
                            label="State"
                            mode="outlined"
                            visible={showDropdown}
                            showDropDown={() => setShowDropdown(true)}
                            onDismiss={() => setShowDropdown(false)}
                            value={locationState}
                            setValue={setLocationState}
                            list={statesList}
                        />
                    </View>
                    <View style={styles.inputHolder}>
                        {!pickerIsOpen && (
                            <>
                                <GeoCitiesButton buttonColor={colors.geoCitiesBlue} onPress={() => setPickerIsOpen(true)} text="Birthday" textColor={colors.white} />
                                <HelperText type="info">
                                    Required* (Must be at least 13 years old)
                                </HelperText>
                            </>
                        )}
                        {pickerIsOpen && (
                                <View>
                                    <DateTimePicker 
                                        accentColor={colors.white}
                                        display="spinner"
                                        maximumDate={new Date()}
                                        mode="date"
                                        onChange={handleBirthdayChange}
                                        testID="dateTimePicker"
                                        textColor={colors.white}
                                        value={birthday}
                                    />
                                    <GeoCitiesButton
                                        buttonColor={colors.geoCitiesBlue}
                                        onPress={() => setPickerIsOpen(false)}
                                        text="Select"
                                        textColor={colors.white}
                                    />
                                </View>
                            )}
                        <View style={styles.inputHolder}>
                            <GeoCitiesButton
                                buttonColor={colors.geoCitiesGreen}
                                icon="camera"
                                onPress={takePicture}
                                text="Avatar"
                                textColor={colors.white}
                            />
                            <HelperText type="info">
                                Required* 
                            </HelperText>
                        </View>
                        <View style={styles.inputHolder}>
                            <GeoCitiesButton
                                buttonColor={colors.fbBlue}
                                icon="facebook"
                                onPress={facebookConfirmation}
                                text="Facebook Login"
                                textColor={colors.white}
                            />
                        </View>
                        <View style={styles.bottomButtonContainer}>
                            <GeoCitiesButton
                                buttonColor={colors.crimson}
                                onPress={handleSubmit}
                                text="Submit"
                                textColor={colors.white}
                            />
                        </View>
                    </View>
                </ScrollView>
            </Surface>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomButtonContainer: {
        paddingTop: 20,
    },
    datePickerStyles: {
        color: colors.white,
    },
    formContainer: {
        borderRadius: 20,
        height: '75%',
        paddingBottom: 50,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        width: '100%',
    },
    inputHolder: {
        marginTop: 10,
    },
    keyboardContainer: {
        flex: 1,
    },
    loginContainer: {
        alignItems: 'center',
        backgroundColor: colors.nightGray,
        height: '100%',
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 75,
        width:'100%',
    },
    logoContainer: {
        paddingBottom: 50,
        paddingTop: 20,
    },
});