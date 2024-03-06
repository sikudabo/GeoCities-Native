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
    setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
    showDropdown: boolean;
    takePicture: () => void;
    
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
    setShowDropdown,
    showDropdown,
    takePicture,
}: SettingsScreenDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="Settings" />
            </View>
            <SafeAreaView>
                <ScrollView>
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <GeoCitiesAvatar size={75} src={avatarPath} />
                        </View>
                        <GeoCitiesButton buttonColor={colors.salmonPink} icon="camera" text="Change" />
                    </View>
                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <TextInput activeOutlineColor={colors.salmonPink} label="Email" mode="outlined" onChangeText={handleEmailChange} outlineColor={colors.white} placeholder={email} returnKeyType="send" value={currentEmail} />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput activeOutlineColor={colors.salmonPink} label="City" mode="outlined" onChangeText={handleCityChange} outlineColor={colors.white} placeholder={locationCity} returnKeyType="send" value={currentLocationCity} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Dropdown
                                activeColor={colors.salmonPink}
                                dropDownItemTextStyle={{
                                    color: colors.white,
                                }}
                                dropDownItemSelectedTextStyle={{
                                    color: colors.salmonPink,
                                }}
                                label="Topic"
                                mode="outlined"
                                visible={showDropdown}
                                showDropDown={() => setShowDropdown(true)}
                                onDismiss={() => setShowDropdown(false)}
                                value={locationState}
                                setValue={() => {}}
                                list={statesList}
                            />
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
    const [showDropdown, setShowDropdown] = useState(false);
    const avatarPath = `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${avatar}`;
    const { setIsLoading } = useShowLoader();
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError, } = useShowDialog();

    function handleCityChange(newCity: string) {
        setCurrentLocationCity(newCity);
    }

    function handleEmailChange(newEmail: string) {
        setCurrentEmail(newEmail);
    }

    async function takePicture() {
        setIsLoading(true);
        await ImagePicker.requestCameraPermissionsAsync();
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (result.canceled) {
            setIsLoading(false);
            return;
        }

        const localUri = result.assets[0].uri;

        await FileSystem.uploadAsync(`${process.env.EXPO_PUBLIC_API_BASE_URI}${avatar}`, localUri, {
            fieldName: 'avatar',
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        }).then((response: any) => {
            const { isError, message } = JSON.parse(response.body);
            
            setIsLoading(false);

            if (!isError) {
                setDialogMessage(message);
                setDialogTitle('Success!');
                setIsError(false);
                handleDialogMessageChange(true);
                return;
            } else {
                setDialogMessage('There was an error changing the avatar image for this group. Please try again!');
                setDialogTitle('Uh Oh!');
                setIsError(true);
                handleDialogMessageChange(true);
                return;
            }
        }).catch(e => {
            setIsLoading(false);
            console.log('There was an error changing the group avatar:', e.message);
            setDialogMessage('There was an error changing the avatar image for this group. Please try again!');
            setDialogTitle('Uh Oh!');
            setIsError(true);
            handleDialogMessageChange(true);
            return;
        });   
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
        setShowDropdown,
        showDropdown,
        takePicture,
    };

}

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: 'center',
    },
    avatarSection: {
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        rowGap: 20,
    },
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