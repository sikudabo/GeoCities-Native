import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import Dropdown from 'react-native-paper-dropdown';
import { TextInput } from 'react-native-paper';
import * as FaceDetector from 'expo-face-detector';
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

type SettingsScreenProps = {
    navigation: any;
};

type SettingsScreenDisplayLayerProps = {
    avatarPath: string;
    blockedUsers: Array<UserType>;
    currentLocationCity: string;
    currentEmail: string;
    email: string;
    handleBlockScreenPress: () => void;
    handleCityChange: (newCity: string) => void;
    handleEmailChange: (newEmail: string) => void;
    handleStateChange: (newState: string) => void;
    handleSubmit: () => void
    handleUnblockUser: (userId: string) => void;
    isLoading: boolean;
    locationCity: string;
    locationState: string;
    setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
    showDropdown: boolean;
    takePicture: () => void;
    
};

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
    return <SettingsScreen_DisplayLayer {...useDataLayer({ navigation })} />;
}

function SettingsScreen_DisplayLayer({
    avatarPath,
    blockedUsers,
    currentLocationCity,
    currentEmail,
    email,
    handleBlockScreenPress,
    handleCityChange,
    handleEmailChange,
    handleStateChange,
    handleSubmit,
    handleUnblockUser,
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
                        <GeoCitiesButton buttonColor={colors.salmonPink} icon="camera" onPress={takePicture} text="Change" />
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
                            <GeoCitiesButton buttonColor={colors.error} icon="cancel" onPress={handleBlockScreenPress} text="Block" />
                        </View>
                        {blockedUsers.length > 0 && (
                            <View>
                                <View style={styles.blockedUsersSectionHeader}>
                                    <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="Blocked Users" />
                                </View>
                                {blockedUsers.map((user, index) => (
                                    <View
                                        key={index}
                                        style={styles.userContainer}
                                    >
                                        <View>
                                            <GeoCitiesAvatar size={50} src={`${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${user.avatar}`} />
                                        </View>
                                        <View style={styles.userNameContainer}>
                                            <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight='normal' text={`${user.firstName} ${user.lastName}`} />
                                        </View>
                                        <View style={styles.unBlockButtonContainer}>
                                            <GeoCitiesButton buttonColor={colors.salmonPink} mode="outlined" onPress={() => handleUnblockUser(user._id)} text="Unblock" />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

function useDataLayer({ navigation }: SettingsScreenProps) {
    const { user, setUser } = useUser();
    const { avatar, blockedList, email, _id, locationCity, locationState } = user;
    const { data: blockedUsers, isLoading } = useFetchBlockedUsers();
    const [currentEmail, setCurrentEmail] = useState(email);
    const [currentLocationCity, setCurrentLocationCity] = useState(locationCity);
    const [showDropdown, setShowDropdown] = useState(false);
    const avatarPath = `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${avatar}`;
    const { setIsLoading } = useShowLoader();
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError, } = useShowDialog();

    function handleBlockScreenPress() {
        navigation.navigate('ProfileBlockScreen', { _id, blockedList, email, locationCity, locationState });
    }

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
                blockedList,
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
                blockedList,
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

    async function handleUnblockUser(userId: string) {
        setIsLoading(true);
        const newBlockedList = blockedList.filter((id: string) => id !== userId);

        await postNonBinaryData({
            data: {
                _id,
                blockedList: newBlockedList,
                email,
                isUnblocking: true,
                locationCity,
                locationState,
                userId,
            },
            uri: 'update-user',
        }).then(res => {
            const { isError, message, updatedUser } = res;
            if (!isError) {
                let newUser = updatedUser;
                newUser.isLoggedIn = true;
                setUser(newUser);
            }

            setIsLoading(false);
            setDialogMessage(isError ? message : 'Successfully unblocked user');
            setDialogTitle(isError ? 'Uh Oh!' : 'Success!');
            setIsError(isError);
            handleDialogMessageChange(true);
            return;
        }).catch(err => {
            console.log(`There was an error unblocking a user from a personal profile: ${err.message}`);
            setIsLoading(false);
            setDialogMessage('There was an error unblocking that user. Please try again!');
            setDialogTitle('Uh Oh!');
            setIsError(true);
            handleDialogMessageChange(true);
            return;
        });
    }

    async function takePicture() {
        setIsLoading(true);
        await ImagePicker.requestCameraPermissionsAsync();
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            cameraType: ImagePicker.CameraType.front,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (result.canceled) {
            setIsLoading(false);
            return;
        }

        const localUri = result.assets[0].uri;

        await FaceDetector.detectFacesAsync(localUri, {
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
            mode: FaceDetector.FaceDetectorMode.fast,
            runClassifications: FaceDetector.FaceDetectorClassifications.all,
        }).then(result => {
            if (result.faces.length === 0) {
                setDialogMessage('We could not detect a human face in this picture. Please select another picture.');
                setDialogTitle('Uh Oh!');
                setIsError(true);
                handleDialogMessageChange(true);
                return;
            }
        });

        await FileSystem.uploadAsync(`${process.env.EXPO_PUBLIC_API_BASE_URI}change-user-avatar/${_id}/${avatar}`, localUri, {
            fieldName: 'avatar',
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        }).then((response: any) => {
            const { isError, message, updatedUser } = JSON.parse(response.body);
            
            setIsLoading(false);

            if (!isError) {
                setDialogMessage(message);
                setDialogTitle('Success!');
                setIsError(false);
                handleDialogMessageChange(true);
                let newUser = updatedUser;
                newUser.isLoggedIn = true;
                setUser(newUser);
                return;
            } else {
                setDialogMessage('There was an error changing your avatar image. Please try again!');
                setDialogTitle('Uh Oh!');
                setIsError(true);
                handleDialogMessageChange(true);
                return;
            }
        }).catch(e => {
            setIsLoading(false);
            console.log('There was an error changing a user avatar:', e.message);
            setDialogMessage('There was an error changing your avatar. Please try again!');
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
        handleBlockScreenPress,
        handleCityChange,
        handleEmailChange,
        handleStateChange,
        handleSubmit,
        handleUnblockUser,
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
        paddingBottom: 30,
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
    unBlockButtonContainer: {
        marginLeft: 'auto',
    },
    userContainer: {
        columnGap: 20,
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },
    userNameContainer: {
        paddingTop: 10,
    },
});