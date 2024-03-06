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
    handleBackPress: () => void;
    handleSubmit: (userId: string) => void;
    isLoading: boolean;
    users: Array<UserType>;
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
    handleBackPress,
    handleSubmit,
    isLoading,
    users,
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

    function handleBackPress() {
        navigation.navigate('SettingsScreen');
        return;
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
        handleBackPress,
        handleSubmit,
        isLoading,
        users,
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