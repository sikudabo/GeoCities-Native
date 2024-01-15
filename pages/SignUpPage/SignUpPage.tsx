import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import axios, { GenericFormData } from 'axios';
import Dropdown from 'react-native-paper-dropdown';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as ImagePicker from 'expo-image-picker';
import { HelperText, Surface, TextInput } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { states } from '../../utils/constants';
import { useShowDialog, useShowLoader } from '../../hooks';
import { useUser } from '../../hooks/storage-hooks';
import { putBinaryData } from '../../utils/requests';
import { checkValidAge, checkValidEmail, formatUserBirthday } from '../../utils/helpers';
import { GeoCitiesButton, GeoCitiesLogo, colors } from '../../components';

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
    const [name, setName] = useState('');
    const [fbId, setFbId] = useState('');
    const { setUser } = useUser();
    const { setIsLoading } = useShowLoader();
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
        setName(filename as string);
    }

    async function facebookConfirmation() {

        const response = await fbPromptAsync();
        
        if (response.type === 'success') {
            const { accessToken } = response?.authentication ? response.authentication : { accessToken: '' };
            if (accessToken) {
                await axios({
                    method: 'GET',
                    url: `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
                }).then(res => {
                    const { id, name } = res.data;
                    setFirstName(name.split(' ')[0]);
                    setLastName(name.split(' ')[1]);
                    setFbId(id);
                }).catch(err => {
                    setIsLoading(false);
                    setIsError(true);
                    setDialogTitle('Whoops!');
                    setDialogMessage(err.message);
                    handleDialogMessageChange(true);
                    console.log('There was an error:', err.message);
                });
            } else {
                setIsError(true);
                setDialogTitle('Whoops!');
                setDialogMessage('There was an error logging you into your Facebook account. Please try again!');
                handleDialogMessageChange(true);
                return;
            }
        } else if ((response.type === 'cancel' || response.type === 'dismiss') && !firstName && !lastName) {
            setIsError(true);
            setDialogTitle('Whoops!');
            setDialogMessage('You must log in with Facebook in order to verify your account.');
            handleDialogMessageChange(true);
            return;
        } else if(!firstName && !lastName){
            setIsError(true);
            setDialogTitle('Whoops!');
            setDialogMessage('You must log in with Facebook in order to verify your account.');
            handleDialogMessageChange(true);
            return;
        }
    }

    async function handleSubmit() {
        setIsLoading(true);
        if (!checkValidEmail(email)) {
            setIsLoading(false);
            setIsError(true);
            setDialogTitle('Whoops!');
            setDialogMessage('You must enter a valid email address.');
            handleDialogMessageChange(true);
            return;
        }

        if (password.length < 6) {
            setIsLoading(false);
            setIsError(true);
            setDialogTitle('Whoops!');
            setDialogMessage('You must enter a password that is at least 6 characters long.');
            handleDialogMessageChange(true);
            return;
        }

        if (!city) {
            setIsLoading(false);
            setIsError(true);
            setDialogTitle('Whoops!');
            setDialogMessage('You must enter the city you currently live in.');
            handleDialogMessageChange(true);
            return;
        }

        if (!checkValidAge(formatUserBirthday(birthday))) {
            setIsLoading(false);
            setIsError(true);
            setDialogTitle('Whoops!');
            setDialogMessage('You must at least be 13 years old to sign up for GeoCities.');
            handleDialogMessageChange(true);
            return;
        }

        if (!avatar || !name || !uri) {
            setIsLoading(false);
            setIsError(true);
            setDialogTitle('Whoops!');
            setDialogMessage('You must enter a picture of yourself. Not adding a selfie will lead to your account being deleted. This helps reduce trolling and makes sure everyone on GeoCities is a real human.');
            handleDialogMessageChange(true);
            return;
        }

        if (!firstName || !lastName) {
            setIsLoading(false);
            setIsError(true);
            setDialogTitle('Whoops!');
            setDialogMessage('You need to login with Facebook so that we can retrieve your first and last name to make sure you are a real human.');
            handleDialogMessageChange(true);
            return;
        }

        const fd: GenericFormData = new FormData();
        fd.append('firstName', firstName);
        fd.append('lastName', lastName);
        fd.append('email', email);
        fd.append('password', password); 
        fd.append('dob', String(birthday));
        fd.append('locationCity', city);
        fd.append('locationState', locationState);
        fd.append('fbId', fbId);
        fd.append('avatar', { name, uri, type: 'image'});

        await putBinaryData({
            data: fd,
            uri: 'user-signup',
        }).then(res => {
            const { isError, message, user } = res;
            if (!isError) {
                setIsLoading(false);
                setIsError(false);
                setDialogTitle('Success!');
                setDialogMessage('We have successfully created your GeoCities account.');
                handleDialogMessageChange(true);
                const newUser = user;
                newUser.isLoggedIn = true;
                setUser(newUser);
                return;
            } else {
                setIsLoading(false);
                setIsLoading(false);
                setIsError(true);
                setDialogTitle('Whoops!');
                setDialogMessage(message);
                handleDialogMessageChange(true);
                return;
            }
        }).catch(err => {
            setIsLoading(false);
        });
    }

    return (
        <View style={styles.loginContainer}>
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
        paddingTop: 20,
        width:'100%',
    },
    logoContainer: {
        paddingBottom: 50,
    },
});