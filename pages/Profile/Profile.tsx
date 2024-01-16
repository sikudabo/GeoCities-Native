import { useEffect } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GeoCitiesBodyText } from '../../components';
import { useUser } from '../../hooks/storage-hooks';
import { useFetchUserData } from '../../hooks/fetch-hooks';
import { UserType } from '../../typings';

type ProfileProps = {
    navigation: any;
}

type ProfileDisplayLayerProps = {
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
    handleNavigation,
    user,
}: ProfileDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <Button onPress={handleNavigation} title="Feed" />
            <GeoCitiesBodyText text={`Welcome ${user.firstName}!`} />
        </View>
    );
}

function useDataLayer({ navigation }: ProfileProps) {
    const { user, setUser } = useUser();
    const { _id } = user;
    const { data, isLoading } = useFetchUserData({ _id });
    const { user: currentUser } = typeof data !== 'undefined' && !isLoading ? data : { user: undefined };

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        setUser(currentUser);
    }, [currentUser]);


    function handleNavigation() {
        navigation.navigate('Feed');
    }

    return {
        handleNavigation,
        user,
    };
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 50,
    }
});

