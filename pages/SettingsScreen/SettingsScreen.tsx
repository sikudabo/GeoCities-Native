import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import Dropdown from 'react-native-paper-dropdown';
import { TextInput } from 'react-native-paper';
import * as FileSystem from 'expo-file-system'; 
import * as ImagePicker from 'expo-image-picker';
import { checkValidEmail } from '../../utils/helpers';
import { states } from '../../utils/constants';
import { StateObjectType } from '../SignUpPage/SignUpPage';
import { useFetchBlockedUsers } from '../../hooks/fetch-hooks';
import { useUser } from '../../hooks/storage-hooks';
import { UserType } from '../../typings';
import { useShowDialog, useShowLoader } from '../../hooks';
import { postNonBinaryData } from '../../utils/requests';
import { GeoCitiesAvatar, GeoCitiesBodyText, GeoCitiesButton, LoadingIndicator, colors } from '../../components';

let statesList: StateObjectType[] = []

states.forEach(state => {
    statesList.push({ label: state, value: state });
});

type SettingsScreenDisplayLayerProps = {
    avatarPath: string;
    blockedUsers: Array<UserType>;
    currentLocationCity: string;
    currentEmail: string;
    email: string;
    handleCityChange: (newCity: string) => void;
    handleEmailChange: (newEmail: string) => void;
    handleStateChange: (newState: string) => void;
    handleSubmit: () => void
    isLoading: boolean;
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
    blockedUsers,
    currentLocationCity,
    currentEmail,
    email,
    handleCityChange,
    handleEmailChange,
    handleStateChange,
    handleSubmit,
    isLoading,
    locationCity,
    locationState,
    setShowDropdown,
    showDropdown,
    takePicture,
}: SettingsScreenDisplayLayerProps) {

    if (isLoading) {
        return <LoadingIndicator />;
    }

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
                            <TextInput activeOutlineColor={colors.salmonPink} label="Email" mode="outlined" onChangeText={handleEmailChange} onSubmitEditing={() => handleSubmit()} outlineColor={colors.white} placeholder={email} returnKeyType="send" value={currentEmail} />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput activeOutlineColor={colors.salmonPink} label="City" mode="outlined" onChangeText={handleCityChange} onSubmitEditing={() => handleSubmit()} outlineColor={colors.white} placeholder={locationCity} returnKeyType="send" value={currentLocationCity} />
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
                                label="State"
                                mode="outlined"
                                visible={showDropdown}
                                showDropDown={() => setShowDropdown(true)}
                                onDismiss={() => setShowDropdown(false)}
                                value={locationState}
                                setValue={(val) => handleStateChange(val)}
                                list={statesList}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <GeoCitiesButton buttonColor={colors.error} icon="cancel" text="Block" />
                        </View>
                        {blockedUsers.length > 0 && (
                            <View>
                                <View style={styles.blockedUsersSectionHeader}>
                                    <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="Blocked Users" />
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

function useDataLayer() {
    const { user, setUser } = useUser();
    const { avatar, blockList, email, _id, locationCity, locationState } = user;
    const { data: blockedUsers, isLoading } = useFetchBlockedUsers();
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

    async function handleStateChange(newState: string) {
        setIsLoading(true);
        await postNonBinaryData({
            data: {
                _id,
                blockList,
                email,
                locationCity,
                locationState: newState
            },
            uri: 'update-user',
        }).then(res => {
            const { isError, message, updatedUser } = res;
            setIsLoading(false);
            setDialogMessage(message);
            setDialogTitle(isError ? 'Uh Oh!' : 'Success!');
            setIsError(isError);
            handleDialogMessageChange(true);

            if (!isError) {
                let newUser = updatedUser;
                newUser.isLoggedIn = true;
                setUser(newUser);
            }

            return;
        }).catch(err => {
            console.log(`There was an error updating a users' location state: ${err.message}`);
            setIsLoading(false);
            setDialogMessage('There was an error updating your location state. Please try again!');
            setDialogTitle('Uh Oh!');
            setIsError(true);
            handleDialogMessageChange(true);
            return;
        });
    }

    async function handleSubmit() {
        setIsLoading(true);

        if (!currentEmail.trim() || !checkValidEmail(currentEmail.trim())) {
            setIsLoading(false);
            setDialogMessage('Please enter a valid email.');
            setDialogTitle('Uh Oh!');
            setIsError(true);
            handleDialogMessageChange(true);
            return;
        }

        if (!currentLocationCity.trim()) {
            setIsLoading(false);
            setDialogMessage('You must enter the city you reside in.');
            setDialogTitle('Uh Oh!');
            setIsError(true);
            handleDialogMessageChange(true);
            return;
        }

        await postNonBinaryData({
            data: {
                _id,
                blockList,
                email: currentEmail.trim(),
                locationCity: currentLocationCity.trim(),
                locationState,
            },
            uri: 'update-user',
        }).then(res => {
            const { isError, message, updatedUser } = res;
            setIsLoading(false);
            setDialogMessage(message);
            setDialogTitle(isError ? 'Uh Oh!' : 'Success');
            setIsError(isError);
            handleDialogMessageChange(true);

            if (!isError) {
                let newUser = updatedUser;
                newUser.isLoggedIn = true;
                setUser(newUser);
            }

            return;
        }).catch(err => {
            console.log(`There was an error updating a user: ${err.message}`);
            setIsLoading(false);
            setDialogMessage('There was an error updating your profile. Please try again!');
            setDialogTitle('Uh Oh!');
            setIsError(true);
            handleDialogMessageChange(true);
            return;
        });
    }

    async function takePicture() {
        setIsLoading(true);
        await ImagePicker.requestCameraPermissionsAsync();
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
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
        blockedUsers,
        currentLocationCity,
        currentEmail,
        email,
        handleCityChange,
        handleEmailChange,
        handleStateChange,
        handleSubmit,
        isLoading,
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
    blockedUsersSectionHeader: {
        alignItems: 'center',
        paddingTop: 20,
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