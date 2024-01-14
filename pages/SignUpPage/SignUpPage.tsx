import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { HelperText, Surface, TextInput } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { GeoCitiesBodyText, GeoCitiesButton, GeoCitiesLogo, colors } from '../../components';

export default function SignUpPage() {
    const [pickerIsOpen, setPickerIsOpen] = useState(false);
    const [birthday, setBirthday] = useState(new Date(2023, 2, 21));

    function handleBirthdayChange(event: DateTimePickerEvent, date: any) {
        const newDate = new Date(date);
        setBirthday(newDate);
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
                                        display="inline"
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