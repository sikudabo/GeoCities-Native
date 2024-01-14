import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import Dropdown from 'react-native-paper-dropdown';
import * as ImagePicker from 'expo-image-picker';
import { HelperText, Surface, TextInput } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { states } from '../../utils/constants';
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
    const [showDropdown, setShowDropdown] = useState(false);
    const [locationState, setLocationState] = useState(states[0]);
    const [avatar, setAvatar] = useState<any>();
    const [uri, setUri] = useState<Blob | null>(null);
    const [fileName, setFileName] = useState('');

    function handleBirthdayChange(event: DateTimePickerEvent, date: any) {
        const newDate = new Date(date);
        setBirthday(newDate);
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

    return (
        <View style={styles.loginContainer}>
            <GeoCitiesBodyText color={colors.white} text="Sign Up" fontSize={30} fontWeight={900} />
            <View style={styles.logoContainer}>
                <GeoCitiesLogo color={colors.white} height={40} width={40} />
            </View>
            <Surface elevation={4} style={styles.formContainer}>
                <ScrollView>
                    <View style={styles.inputHolder}>
                        <KeyboardAvoidingView behavior="padding" style={styles.keyboardContainer}>
                            <TextInput mode='outlined' label="Email" left={<TextInput.Icon icon="mail" />} outlineColor={colors.geoCitiesGreen} placeholder="Email" activeOutlineColor={colors.white} />
                        </KeyboardAvoidingView>
                    </View>
                    <View style={styles.inputHolder}>
                        <KeyboardAvoidingView behavior="padding" style={styles.keyboardContainer}>
                            <TextInput mode='outlined' label="Password" left={<TextInput.Icon icon="lock" />} outlineColor={colors.geoCitiesGreen} placeholder="Password" activeOutlineColor={colors.white} secureTextEntry />
                        </KeyboardAvoidingView>
                    </View>
                    <KeyboardAvoidingView behavior="padding" style={styles.keyboardContainer}>
                        <View style={styles.inputHolder}>
                            <TextInput mode='outlined' label="City" left={<TextInput.Icon icon="city" />} outlineColor={colors.geoCitiesGreen} placeholder="City" activeOutlineColor={colors.white} />
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
                    </View>
                </ScrollView>
            </Surface>
        </View>
    );
}

const styles = StyleSheet.create({
    datePickerStyles: {
        color: colors.white,
    },
    formContainer: {
        height: '100%',
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
        paddingTop: 75,
        width:'100%',
    },
    logoContainer: {
        paddingBottom: 50,
        paddingTop: 20,
    },
});