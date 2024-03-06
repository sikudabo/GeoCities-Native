import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Autocomplete, FlatDropdown } from '@telenko/react-native-paper-autocomplete';
import { UserType } from '../../typings';
import { useFetchAllUsers } from '../../hooks/fetch-hooks';
import { useUser } from '../../hooks/storage-hooks';
import { BlockUsersScreenDisplayLayerProps } from '../GroupScreen/SettingsTab/BlockUserScreen/BlockUsersScreen';
import { GeoCitiesAvatar, GeoCitiesBodyText, LoadingIndicator, colors } from '../../components';

type UserSearchScreenProps = {
    navigation: any;
};

type UserSearchScreenDisplayLayerProps = Omit<BlockUsersScreenDisplayLayerProps, 'handleBackPress' | 'handleUserPress'> & {
    handleUserPress: (userId: string) => void;
};

export default function UserSearchScreen({ navigation }: UserSearchScreenProps) {
    return <UserSearchScreen_DisplayLayer {...useDataLayer({ navigation })} />;
}

function UserSearchScreen_DisplayLayer({
    handleAutocompleteChange,
    handleInputValChange,
    handleUserPress,
    inputVal,
    isLoading,
    options,
    selectedUser,
}: UserSearchScreenDisplayLayerProps) {
    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerTitleContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="Users" />
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
                            <TouchableOpacity onPress={() => handleUserPress(_id)} style={styles.dropdownItemContainer}>
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

function useDataLayer({ navigation }: UserSearchScreenProps) {
    const { user } = useUser();
    const { _id, blockedFrom, blockList } = user;
    const { data: users, isLoading } = useFetchAllUsers();
    let options: { label: string; value: string; }[] = [];

    if (typeof users !== 'undefined' && !isLoading) {
        users.forEach(user => {
            if (user._id === _id || blockList?.includes(user._id) || blockedFrom?.includes(user._id)) {
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

    function handleAutocompleteChange(props: any) {
        setSelectedUser(props);
        setInputVal(props);
    }

    function handleInputValChange(props: any) {
        setInputVal(props);
    }

    function handleUserPress(userId: string) {
        navigation.navigate('Profile', { isVisitor: true, userId });
        return;
    }

    return {
        handleAutocompleteChange,
        handleInputValChange,
        handleUserPress,
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
    headerTitleContainer: {
        alignItems: 'center',
        width: '100%',
    },
});