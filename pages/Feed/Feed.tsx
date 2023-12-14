import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { colors, GeoCitiesButton, GeoCitiesLogo } from '../../components';
const geocitiesLogoIcon = require('../../assets/static-images/icon.svg');
const simeonIcon = require('../../assets/static-images/simeon_profile.jpeg');

type FeedProps = {
    navigation: any;
};

type FeedDisplayLayerProps = {
    handleNavigation: () => void;
};

type NavigationProps = {
    navigation: {
        navigate: (name: string, params?: any) => void;
    };
};

export default function Feed({ navigation }: FeedProps) {
    return <Feed_DisplayLayer {...useDataLayer({ navigation })} />;
}

function Feed_DisplayLayer({
    handleNavigation,
}: FeedDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <GeoCitiesButton buttonColor={colors.salmonPink} mode='outlined' onPress={handleNavigation} text="Profile" />
        </View>
    );
}

function useDataLayer({ navigation }: FeedProps) {

    function handleNavigation() {
        navigation.navigate('Profile');
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

