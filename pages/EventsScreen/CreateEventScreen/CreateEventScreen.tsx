import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Dropdown from 'react-native-paper-dropdown';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { HelperText, Surface, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { putBinaryData } from '../../../utils/requests';
import { states } from '../../../utils/constants';
import { useUser } from '../../../hooks/storage-hooks';
import { useShowDialog, useShowLoader } from '../../../hooks';
import { GeoCitiesBackArrowIcon, GeoCitiesBodyText, GeoCitiesButton, colors } from '../../../components';

export type StateObjectType = {
    label: string;
    value: string;
}

let statesList: StateObjectType[] = []

states.forEach(state => {
    statesList.push({ label: state, value: state });
});

type CreateEventScreenProps = {
    navigation: any;
}

type CreateEventScreenDisplayLayerProps = {
    description: string;
    eventAddress: string;
    eventCity: string;
    eventDate: number;
    eventState: string;
    handleBackPress: () => void;
    handleEventAddressChange: (newAddress: string) => void;
    handleEventCityChange: (newCity: string) => void;
    handleEventDateChange: (event: DateTimePickerEvent, date: any) => void;
    handleEventDescriptionChange: (newDescription: string) => void;
    handleEventStateChange: (newState: string) => void;
    handleEventTitleChange: (newTitle: string) => void;
    pickerIsOpen: boolean;
    setPickerIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
    showDropdown: boolean;
    takePicture: () => void;
    title: string;
}

export default function CreateEventScreen({ navigation }: CreateEventScreenProps) {
    return <CreateEventScreen_DisplayLayer {...useDataLayer({ navigation })} />;
}

function CreateEventScreen_DisplayLayer({
    description,
    eventAddress,
    eventCity,
    eventDate,
    eventState,
    handleBackPress,
    handleEventDescriptionChange,
    handleEventAddressChange,
    handleEventCityChange,
    handleEventDateChange,
    handleEventStateChange,
    handleEventTitleChange,
    pickerIsOpen,
    setPickerIsOpen,
    setShowDropdown,
    showDropdown,
    takePicture,
    title,
}: CreateEventScreenDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButtonContainer}>
                    <GeoCitiesBackArrowIcon color={colors.white} height={25} width={25} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="Create Event" />
                </View>
            </View>
            <View style={styles.formContainer}>
                <Surface elevation={4} style={styles.form}>
                    <SafeAreaView>
                        <ScrollView>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    activeOutlineColor={colors.salmonPink}
                                    editable={true}
                                    keyboardType="default"
                                    label="Title"
                                    maxLength={75}
                                    mode="outlined"
                                    onChangeText={handleEventTitleChange}
                                    outlineColor={colors.white}
                                    placeholder="Title..."
                                    returnKeyType="done"
                                    style={styles.textInput}
                                    value={title}
                                    dense
                                />
                                <HelperText type="info">
                                    Required* {`(${title.length} / 75)`}
                                </HelperText>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    activeOutlineColor={colors.salmonPink}
                                    editable={true}
                                    keyboardType="default"
                                    label="Description"
                                    maxLength={300}
                                    mode="outlined"
                                    numberOfLines={5}
                                    onChangeText={handleEventDescriptionChange}
                                    outlineColor={colors.white}
                                    placeholder="Description..."
                                    returnKeyType="done"
                                    style={styles.textInputMulti}
                                    value={description}
                                    blurOnSubmit
                                    dense
                                    multiline
                                />
                                <HelperText type="info">
                                    Required* {`(${description.length} / 300)`}
                                </HelperText>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    activeOutlineColor={colors.salmonPink}
                                    editable={true}
                                    keyboardType="default"
                                    label="City"
                                    mode="outlined"
                                    onChangeText={handleEventCityChange}
                                    outlineColor={colors.white}
                                    placeholder="City..."
                                    returnKeyType="done"
                                    style={styles.textInput}
                                    value={eventCity}
                                    dense
                                />
                                <HelperText type="info">
                                    Required*
                                </HelperText>
                            </View>
                            <View style={styles.inputContainer}>
                                <Dropdown
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
                                    value={eventState}
                                    setValue={handleEventStateChange}
                                    list={statesList}
                                />
                                <HelperText type="info">
                                    Required*
                                </HelperText>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    activeOutlineColor={colors.salmonPink}
                                    editable={true}
                                    keyboardType="default"
                                    label="Address"
                                    mode="outlined"
                                    onChangeText={handleEventAddressChange}
                                    outlineColor={colors.white}
                                    placeholder="Address..."
                                    returnKeyType="done"
                                    style={styles.textInput}
                                    value={eventAddress}
                                    dense
                                />
                                <HelperText type="info">
                                    Required*
                                </HelperText>
                            </View>
                            {!pickerIsOpen && (
                                <View style={styles.inputContainer}>
                                    <GeoCitiesButton buttonColor={colors.babyBlue} icon="calendar" onPress={() => setPickerIsOpen(true)} text="Date" textColor={colors.white} />
                                    <HelperText type="info">
                                        Required* (Select a date)
                                    </HelperText>
                                </View>
                            )}
                            {pickerIsOpen && (
                                <View>
                                    <GeoCitiesButton
                                        buttonColor={colors.babyBlue}
                                        onPress={() => setPickerIsOpen(false)}
                                        text="Press to confirm date"
                                        textColor={colors.white}
                                    />
                                    <DateTimePicker
                                        accentColor={colors.white}
                                        display="spinner"
                                        minimumDate={new Date()}
                                        mode="date"
                                        onChange={handleEventDateChange}
                                        testID="dateTimePicker"
                                        value={new Date(eventDate)}
                                    />
                                </View>
                            )}
                            <View style={styles.inputContainer}>
                                <GeoCitiesButton buttonColor={colors.crimson} icon="camera" onPress={takePicture} text="Event Avatar" />
                                <HelperText type="info">
                                    Required* (Photo for event)
                                </HelperText>
                            </View>
                            <View style={styles.submitButtonContainer}>
                                <GeoCitiesButton buttonColor={colors.salmonPink} text="Submit" />
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </Surface>
            </View>
        </View>
    );
}

function useDataLayer({ navigation }: CreateEventScreenProps) {
    const { user } = useUser();
    const { _id: authorId, firstName, lastName } = user;
    const [avatar, setAvatar] = useState<any>();
    const [description, setDescription] = useState('');
    const [eventAddress, setEventAddress] = useState('');
    const [eventCity, setEventCity] = useState('');
    const [eventDate, setEventDate] = useState(new Date().getTime());
    const [eventState, setEventState] = useState(states[0]);
    const [photoName, setPhotoName] = useState('');
    const [photoUri, setPhotoUri] = useState<Blob | null>(null);
    const [pickerIsOpen, setPickerIsOpen] = useState<boolean>(false);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [title, setEventTitle] = useState('');
    const userName = `${firstName} ${lastName}`;
    const { setIsLoading } = useShowLoader();
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError } = useShowDialog();

    function handleBackPress() {
        navigation.navigate('EventsScreen');
        return;
    }

    function handleEventDescriptionChange(newDescription: string) {
        setDescription(newDescription);
    }

    function handleEventAddressChange(newAddress: string) {
        setEventAddress(newAddress);
    }

    function handleEventCityChange(newCity: string) {
        setEventCity(newCity);
    }

    function handleEventDateChange(event: DateTimePickerEvent, date: any) {
        const newDate = new Date(date).getTime();
        setEventDate(newDate);
    }

    function handleEventStateChange(newState: string) {
        setEventState(newState);
    }

    function handleEventTitleChange(newTitle: string) {
        setEventTitle(newTitle);
    }

    async function handleSubmit() {
        setIsLoading(true);
        setIsError(true);
        setDialogTitle('Uh Oh!');

        if (!description.trim()) {
            setDialogMessage('You must enter a description!');
            handleDialogMessageChange(true);
            setIsLoading(false);
            return;
        }

        if (description.length > 300) {
            setDialogMessage('The group description must be 300 characters or less.');
            handleDialogMessageChange(true);
            setIsLoading(false);
            return;
        }

        if (!eventAddress.trim()) {
            setDialogMessage('You must enter an address for this event!');
            handleDialogMessageChange(true);
            setIsLoading(false);
            return;
        }

        if (!eventCity.trim()) {
            setDialogMessage('You must enter a city for this event!');
            handleDialogMessageChange(true);
            setIsLoading(false);
            return;
        }
    }

    async function takePicture() {

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [16, 9],
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (result.canceled) {
            return;
        }

        const localUri = result.assets[0].uri;
        
        const filename = localUri.split('/').pop();

        setAvatar(result as any);
        setPhotoUri(localUri as any);
        setPhotoName(filename as string);
    }

    return {
        description,
        eventAddress,
        eventCity,
        eventDate,
        eventState,
        handleBackPress,
        handleEventDescriptionChange,
        handleEventAddressChange,
        handleEventCityChange,
        handleEventDateChange,
        handleEventStateChange,
        handleEventTitleChange,
        pickerIsOpen,
        setPickerIsOpen,
        setShowDropdown,
        showDropdown,
        takePicture,
        title,
    };
}

const styles = StyleSheet.create({
    backButtonContainer: {
        flex: 1
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
    form: {
        borderRadius: 20,
        height: '80%',
        paddingLeft: 10,
        paddingRight: 10,
    },
    header: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 50,
        paddingLeft: 10,
        paddingRight: 10,
    },
    headerTitleContainer: {
        flex: 2,
    },
    inputContainer: {
        paddingTop: 20,
    },
    submitButtonContainer: {
        paddingBottom: 20,
        paddingTop: 20,
    },
    textInput: {
        height: 50,
    },
    textInputMulti: {
        height: 75,
    },
});