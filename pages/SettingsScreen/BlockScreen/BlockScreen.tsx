import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Autocomplete, FlatDropdown } from '@telenko/react-native-paper-autocomplete';
import { UserType } from '../../../typings';
import { useUser } from '../../../hooks/storage-hooks';
import { postNonBinaryData } from '../../../utils/requests';
import { useFetchAllUsers } from '../../../hooks/fetch-hooks';
import { useShowDialog, useShowLoader } from '../../../hooks';
import { GeoCitiesAvatar, GeoCitiesBackArrowIcon, GeoCitiesBodyText, LoadingIndicator, colors, } from '../../../components';

type BlockScreenProps = {
    navigation: any;
    route: any;
};


type BlockScreenDisplayLayerProps = {
    handleAutocompleteChange: (val: string) => void;
    handleBackPress: () => void;
    handleInputValChange: (val: string) => void;
    handleSubmit: (userId: string) => void;
    inputVal: string;
    isLoading: boolean;
    options: any;
    selectedUser: string;
};

type DataLayerProps = Pick<BlockScreenProps, 'navigation'> & {
    _id: string;
    blockList: Array<string>;
    email: string;
    locationCity: string;
    locationState: string;
};

export default function BlockScreen({
    navigation,
    route,
}: BlockScreenProps) {
    const { _id, blockList, email, locationCity, locationState } = route.params;
    return <BlockScreen_DisplayLayer {...useDataLayer({ _id, blockList, email, locationCity, locationState, navigation })} />;
}

function BlockScreen_DisplayLayer({
    handleAutocompleteChange,
    handleBackPress,
    handleInputValChange,
    handleSubmit,
    inputVal,
    isLoading,
    options,
    selectedUser,
}: BlockScreenDisplayLayerProps) {
    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity onPress={handleBackPress}>
                        <GeoCitiesBackArrowIcon color={colors.white} height={25} width={25} />
                    </TouchableOpacity>
                </View>
                <View style={styles.headerTitleContainer}>
                    <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="Block Users" />
                </View>
            </View>
            <View style={styles.autoCompleteHolder}>
                <Autocomplete 
                        defaultValue=''
                        filterOptions={(options, input) => {
                            if (!input || input.trim() === '') {
                                return options;
                            }
                            
                            return options.filter((option) => {
                                return option.label.includes(input);
                            });
                        }}
                        inputValue={selectedUser}
                        onChange={handleAutocompleteChange}
                        renderDropdown={(props) => <FlatDropdown activeOutlineColor={colors.salmonPink} label="Users" mode="outlined" onChange={handleInputValChange} outlineColor={colors.salmonPink} placeholder="Users..." {...props} right={<TextInput.Icon icon="arrow-down-circle" />} value={inputVal} />}
                        renderOption={({ onSelect }, { avatarPath, fullName, _id }) => {
                            return (
                                <TouchableOpacity style={styles.dropdownItemContainer}>
                                    <View style={styles.dropdownItemAvatarContainer}>
                                        <GeoCitiesAvatar size={50} src={avatarPath} />
                                    </View>
                                    <View style={styles.dropdownItemNameContainer}>
                                        <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight={900} text={fullName} />
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        options={options}
                        value={selectedUser}
                    />
            </View>
        </View>
    );
}

function useDataLayer({
    _id,
    blockList,
    email,
    locationCity,
    locationState,
    navigation,
}: DataLayerProps) {
    const { data: users, isLoading } = useFetchAllUsers();
    const { setIsLoading } = useShowLoader();
    const { setUser } = useUser();
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError } = useShowDialog();

    let options: any = [];

    if (typeof users !== 'undefined' && !isLoading) {
        users.forEach(user => {
            if (user._id === _id || blockList?.includes(user._id)) {
                return;
            }
            const option = {
                label: `${user.firstName} ${user.lastName}`,
                value: `${user.firstName} ${user.lastName}`,
                avatarPath: `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${user.avatar}`,
                fullName: `${user.firstName} ${user.lastName}`,
                _id: user._id,
                locationCity: user.locationCity,
                locationState: user.locationState,
            };
            options.push(option);
        });
    }

    const [selectedUser, setSelectedUser] = useState('');
    const [inputVal, setInputVal] = useState(selectedUser);

    function handleAutocompleteChange(val: string) {
        setSelectedUser(val);
        setInputVal(val);
    }

    function handleBackPress() {
        navigation.navigate('SettingsScreen');
        return;
    }

    function handleInputValChange(val: string) {
        setInputVal(val);
    }

    async function handleSubmit(userId: string) {
        const newBlockList = [...blockList, userId];

        await postNonBinaryData({
            data: {
                _id,
                blockList: newBlockList,
                email,
                locationCity,
                locationState,
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

            navigation.navigate('SettingsScreen');
            return;
        }).catch(err => {
            console.log(`There was an error blocking a user: ${err.message}`);
            setIsLoading(false);
            setDialogMessage('There was an error blocking that user. Please try again!');
            setDialogTitle('Uh Oh!');
            setIsError(true);
            handleDialogMessageChange(true);
            return;
        });

    }

    return {
        handleAutocompleteChange,
        handleBackPress,
        handleInputValChange,
        handleSubmit,
        inputVal,
        isLoading,
        options,
        selectedUser,
    };
}

const styles = StyleSheet.create({
    autoCompleteHolder: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        width: '100%',
    },
    backButtonContainer: {
        flex: 1
    },
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        paddingTop: 20,
    },
    dropdownItemAvatarContainer: {
        paddingLeft: 10,
    },
    dropdownItemNameContainer: {
        paddingTop: 10,
    },
    dropdownItemContainer: {
        columnGap: 10,
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 10,
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
});