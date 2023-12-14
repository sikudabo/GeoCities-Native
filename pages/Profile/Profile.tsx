import { Button, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type ProfileProps = {
    navigation: any;
}

type ProfileDisplayLayerProps = {
    handleNavigation: () => void;
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
}: ProfileDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <Button onPress={handleNavigation} title="Feed" />
        </View>
    );
}

function useDataLayer({ navigation }: ProfileProps) {

    function handleNavigation() {
        navigation.navigate('Feed');
    }

    return {
        handleNavigation,
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

