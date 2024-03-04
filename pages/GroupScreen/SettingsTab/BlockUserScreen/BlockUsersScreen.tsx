import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Surface, TextInput } from 'react-native-paper';
import { Autocomplete, FlatDropdown, ModalDropdown } from '@telenko/react-native-paper-autocomplete';
import { GroupType, UserType } from '../../../../typings';
import { postNonBinaryData } from '../../../../utils/requests';
import { useFetchAllUsers } from '../../../../hooks/fetch-hooks';
import { GeoCitiesAvatar, GeoCitiesBodyText, GeoCitiesDropdownArrow, LoadingIndicator, colors } from '../../../../components';

type BlockUsersScreenProps = {
    navigation: any;
    route: any;
};

type BlockUsersScreenDisplayLayerProps = {
    handleAutocompleteChange: (props: any) => void;
    handleInputValChange: (props: any) => void;
    inputVal: string;
    isLoading: boolean;
    options: { label: string; value: string; }[];
    selectedUser: any;
    users: Array<UserType>;
};

type DataLayerProps = {
    group: GroupType
    navigation: any;
};

export default function BlockUsersScreen({
    navigation,
    route,
}: BlockUsersScreenProps) {
    const { group } = route.params;
    return <BlockUsersScreen_DisplayLayer {...useDataLayer({ group, navigation})} />;
}

function BlockUsersScreen_DisplayLayer({
    handleAutocompleteChange,
    handleInputValChange,
    inputVal,
    isLoading,
    options,
    selectedUser,
    users,
}: BlockUsersScreenDisplayLayerProps) {

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerTitleContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="Block Users" />
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
                    icon={() => <GeoCitiesDropdownArrow color={colors.white} height={200} width={200} />}
                    inputValue={selectedUser}
                    onChange={handleAutocompleteChange}
                    renderDropdown={(props) => <FlatDropdown activeOutlineColor={colors.salmonPink} label="Users" mode="outlined" onChange={handleInputValChange} outlineColor={colors.salmonPink} placeholder="Users..." {...props} right={<TextInput.Icon icon="arrow-down-circle" />} value={inputVal} />}
                    renderOption={({ onSelect }, { avatarPath, fullName }) => {
                        return (
                            <TouchableOpacity onPress={onSelect} style={styles.dropdownItemContainer}>
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
    group,
    navigation,
}: DataLayerProps) {
    const { blockList, description, groupName, rules, topic } = group;
    const { data: users, isLoading } = useFetchAllUsers();
    let options: { label: string; value: string; }[] = [];

    if (typeof users !== 'undefined' && !isLoading) {
        users.forEach(user => {
            const option = {
                label: `${user.firstName} ${user.lastName}`,
                value: `${user.firstName} ${user.lastName}`,
                avatarPath: `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${user.avatar}`,
                fullName: `${user.firstName} ${user.lastName}`,
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

    return {
        handleAutocompleteChange,
        handleInputValChange,
        inputVal,
        isLoading,
        options,
        selectedUser,
        users: typeof users !== 'undefined' && !isLoading ? users : [],
    }
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