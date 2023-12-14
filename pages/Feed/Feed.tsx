import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { colors, GeoCitiesLogo } from '../../components';
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
            <GeoCitiesLogo color={colors.salmonPink} height={50} onPress={handleNavigation} width={50} />
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

