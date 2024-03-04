import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextInput } from 'react-native-paper';
import { Autocomplete, FlatDropdown } from "@telenko/react-native-paper-autocomplete";
import { useFetchAllGroups } from "../../hooks/fetch-hooks";
import { GeoCitiesAvatar, GeoCitiesBodyText, GeoCitiesButton, LoadingIndicator, colors } from "../../components";

type GroupSearchScreenProps = {
    navigation: any;
};

type GroupSearchScreenDisplayLayerProps = {
    handleAutocompleteChange: (val: string) => void;
    handleInputValChange: (val: string) => void;
    handleVisitPress: (groupName: string) => void;
    inputVal: string;
    isLoading: boolean;
    options: Array<{label: string; value: string;}>;
    selectedGroup: string;
};

export default function GroupSearchScreen({ navigation }: GroupSearchScreenProps) {
    return <GroupSearchScreen_DisplayLayer {...useDataLayer({ navigation })} />;
}

function GroupSearchScreen_DisplayLayer({
    handleAutocompleteChange,
    handleInputValChange,
    handleVisitPress,
    inputVal,
    isLoading,
    options,
    selectedGroup,
}: GroupSearchScreenDisplayLayerProps) {
    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.topHeaderContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="Search for Groups" />
            </View>
            <View style={styles.autoCompleteHolder}>
                <Autocomplete 
                    defaultValue=''
                    filterOptions={(options, input) => {
                        if (!input || input.trim() === '') {
                            return options;
                        }

                        return options.filter((option) => {
                            return option.label.toLowerCase().includes(input.toLowerCase()) || option.topic.toLowerCase().includes(input.toLowerCase());
                        })
                    }}
                    inputValue={selectedGroup}
                    onChange={handleAutocompleteChange}
                    options={options}
                    renderDropdown={(props) => <FlatDropdown activeOutlineColor={colors.salmonPink} label="Groups" mode="outlined" onChange={handleInputValChange} outlineColor={colors.salmonPink} placeholder="Groups..." {...props} right={<TextInput.Icon icon="arrow-down-circle" />} value={inputVal} />}
                    renderOption={({ label }, { avatarPath  }) => {
                        return (
                            <TouchableOpacity style={styles.dropdownItemContainer}>
                                <View style={styles.dropdownItemAvatarContainer}>
                                    <GeoCitiesAvatar size={50} src={avatarPath} />
                                </View>
                                <View style={styles.dropdownItemNameContainer}>
                                    <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight={900} text={label} />
                                </View>
                                <View style={styles.dropdownItemButtonContainer}>
                                    <GeoCitiesButton buttonColor={colors.salmonPink} mode="outlined" onPress={() => handleVisitPress(label)} text="Visit" />
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        </View>
    );
}

function useDataLayer({ navigation }: GroupSearchScreenProps) {
    const { data: groups, isLoading } = useFetchAllGroups();
    let options: { label: string, value: string }[] = [];
    const [selectedGroup, setSelectedGroup] = useState('');
    const [inputVal, setInputVal] = useState(selectedGroup);

    if (typeof groups !== 'undefined' && !isLoading) {
        groups.forEach(group => {
            const option = {
                avatarPath: `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${group.avatar}`,
                label: group.groupName,
                value: group.groupName,
                topic: group.topic,
            }

            options.push(option);
        });
    }

    function handleAutocompleteChange(val: string) {
        setSelectedGroup(val);
        setInputVal(val);
    }

    function handleInputValChange(val: string) {
        setInputVal(val);
    }

    function handleVisitPress(groupName: string) {
        navigation.navigate('GroupScreen', { group: { groupName }});
        return;
    }
    
    return {
        handleAutocompleteChange,
        handleInputValChange,
        handleVisitPress,
        inputVal,
        isLoading,
        options,
        selectedGroup,
    };
}

const styles =  StyleSheet.create({
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
    dropdownItemButtonContainer: {
        marginLeft: 'auto',
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
    dropdownItemNameContainer: {
        paddingTop: 10,
    },
    topHeaderContainer: {
        alignItems: 'center',
        width: '100%',
    },
});