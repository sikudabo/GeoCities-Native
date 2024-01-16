import { useEffect } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GeoCitiesAvatar, GeoCitiesBodyText, colors } from '../../components';
import { useUser } from '../../hooks/storage-hooks';
import { useFetchUserData } from '../../hooks/fetch-hooks';
import { UserType } from '../../typings';

type ProfileProps = {
    navigation: any;
}

type ProfileDisplayLayerProps = {
    avatar: string;
    handleNavigation: () => void;
    user: UserType;
};

type NavigationProps = {
    navigation: {
        navigate: (name: string, params?: any) => void;
    };
};

export default function Profile({ navigation }: ProfileProps) {
    return <Profile_DisplayLayer {...useDataLayer({ navigation })} />;
}

function Profile_DisplayLayer({
    avatar,
    handleNavigation,
    user,
}: ProfileDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <GeoCitiesAvatar src={`${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${avatar}`} size={120} />
            </View>
            <Button onPress={handleNavigation} title="Feed" />
            <GeoCitiesBodyText color={colors.white} text={`Welcome ${user.firstName}!`} />
        </View>
    );
}

function useDataLayer({ navigation }: ProfileProps) {
    const { user, setUser } = useUser();
    const { _id } = user;
    const { data, isLoading } = useFetchUserData({ _id });
    const { user: currentUser } = typeof data !== 'undefined' && !isLoading ? data : { user: undefined };
    const { avatar } = user;

    useEffect(() => {
        if (!currentUser) {
            return;
        }
        let updatedUser = currentUser;
        updatedUser.isLoggedIn = true;
        setUser(updatedUser);
    }, [currentUser]);


    function handleNavigation() {
        navigation.navigate('Feed');
    }

    return {
        avatar,
        handleNavigation,
        user,
    };
}

const styles = StyleSheet.create({
    avatarContainer: {
        paddingTop: 20,
    },
    container: {
        alignItems: 'center',
        backgroundColor: colors.nightGray,
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        paddingTop: 10,
    },
});

