import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import Dropdown from 'react-native-paper-dropdown';
import { HelperText, TextInput } from 'react-native-paper';
import * as FileSystem from 'expo-file-system'; 
import * as ImagePicker from 'expo-image-picker';
import { checkValidEmail } from '../../utils/helpers';
import { states } from '../../utils/constants';
import { StateObjectType } from '../SignUpPage/SignUpPage';
import { useUser } from '../../hooks/storage-hooks';
import { useShowDialog, useShowLoader } from '../../hooks';
import { postNonBinaryData } from '../../utils/requests';
import { GeoCitiesAvatar, GeoCitiesBodyText, GeoCitiesButton, colors } from '../../components';

let statesList: StateObjectType[] = []

states.forEach(state => {
    statesList.push({ label: state, value: state });
});

type SettingsScreenDisplayLayerProps = {
    avatarPath: string;
    currentLocationCity: string;
    currentEmail: string;
    email: string;
    handleCityChange: (newCity: string) => void;
    handleEmailChange: (newEmail: string) => void;
    locationCity: string;
    locationState: string;
};

export default function SettingsScreen() {
    return <SettingsScreen_DisplayLayer {...useDataLayer()} />;
}

function SettingsScreen_DisplayLayer({
    avatarPath,
    currentLocationCity,
    currentEmail,
    email,
    handleCityChange,
    handleEmailChange,
    locationCity,
    locationState,
}: SettingsScreenDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="Settings" />
            </View>
            <SafeAreaView>
                <ScrollView>
                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <TextInput activeOutlineColor={colors.salmonPink} label="Email" mode="outlined" onChangeText={handleEmailChange} outlineColor={colors.white} placeholder={email} returnKeyType="send" value={currentEmail} />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput activeOutlineColor={colors.salmonPink} label="City" mode="outlined" onChangeText={handleCityChange} outlineColor={colors.white} placeholder={locationCity} returnKeyType="send" value={currentLocationCity} />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

function useDataLayer() {
    const { user, setUser } = useUser();
    const { avatar, blockedUsers, email, locationCity, locationState } = user;
    const [currentEmail, setCurrentEmail] = useState(email);
    const [currentLocationCity, setCurrentLocationCity] = useState(locationCity);
    const avatarPath = `${process.env.EXPO_PUBLIC_API}get-photo/${avatar}`;
    const { setIsLoading } = useShowLoader();

    function handleCityChange(newCity: string) {
        setCurrentLocationCity(newCity);
    }

    function handleEmailChange(newEmail: string) {
        setCurrentEmail(newEmail);
    }

    return {
        avatarPath,
        currentLocationCity,
        currentEmail,
        email,
        handleCityChange,
        handleEmailChange,
        locationCity,
        locationState,
    };

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        paddingTop: 20,
    },
    formContainer: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    headerContainer: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    inputContainer: {
        paddingTop: 20,
    },
});