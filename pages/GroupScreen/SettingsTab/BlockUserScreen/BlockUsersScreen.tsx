import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { Surface, TextInput } from 'react-native-paper';
import { Autocomplete, FlatDropdown, ModalDropdown } from '@telenko/react-native-paper-autocomplete';
import { GroupType, UserType } from '../../../../typings';
import { postNonBinaryData } from '../../../../utils/requests';
import { useFetchAllUsers } from '../../../../hooks/fetch-hooks';
import { useUser } from '../../../../hooks/storage-hooks';
import { useShowDialog, useShowLoader } from '../../../../hooks';
import { GeoCitiesAvatar, GeoCitiesBodyText, GeoCitiesDropdownArrow, LoadingIndicator, colors } from '../../../../components';

type BlockUsersScreenProps = {
    navigation: any;
    route: any;
};

type BlockUsersScreenDisplayLayerProps = {
    handleAutocompleteChange: (props: any) => void;
    handleInputValChange: (props: any) => void;
    handleUserPress: (_id: string) => void;
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
    handleUserPress,
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

function useDataLayer({
    group,
    navigation,
}: DataLayerProps) {
    const { blockList, description, groupName, rules, topic } = group;
    const { data: users, isLoading } = useFetchAllUsers();
    let options: { label: string; value: string; }[] = [];
    const queryClient = useQueryClient();
    const { setIsLoading } = useShowLoader();
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError } = useShowDialog();
    const { user } = useUser();
    const { _id } = user;

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
    
    function handleAutocompleteChange(props: any) {
        console.log('The props are:', props);
        setSelectedUser(props);
        setInputVal(props);
    }

    function handleInputValChange(props: any) {
        setInputVal(props);
    }

    async function handleUserPress(_id: string) {
        setIsLoading(true);
        const newBlockList = [...blockList as Array<string>, _id];
        await postNonBinaryData({
            data: {
                blockList: newBlockList,
                description,
                groupName,
                rules,
                topic,
            },
            uri: 'update-group',
        }).then(res => {
            const { isSuccess } = res;
            if (isSuccess) {
                setIsLoading(false);
                queryClient.invalidateQueries(['fetchGroup']);
                setDialogMessage('Successfully blocked user.');
                setDialogTitle('Success!');
                setIsError(false);
                handleDialogMessageChange(true);
                return;
            } else {
                setIsLoading(false);
                setDialogMessage('There was an error blocking that user. Please try again!');
                setDialogTitle('Whoops!');
                setIsError(true);
                handleDialogMessageChange(true);
                return;
            }
        }).catch(err => {
            console.log(`There was an error blocking that user: ${err.message}`);
            setIsLoading(false);
            setDialogMessage('There was an error blocking that user. Please try again!');
            setDialogTitle('Whoops!');
            setIsError(true);
            handleDialogMessageChange(true);
            return;
        });
    }

    return {
        handleAutocompleteChange,
        handleInputValChange,
        handleUserPress,
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