import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { colors, GeoCitiesBodyText } from '../components';
const SimeonProfile = require('../assets/static-images/simeon_profile.jpeg')

export default function SamplePage() {
    return (
        <View style={styles.container}>
            <ImageBackground source={SimeonProfile} style={styles.img}>
                <GeoCitiesBodyText color={colors.error} fontSize={50} fontWeight={900} text="Simeon Ikudabo" />
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    img: {
        height: 500,
        width: '100%',
    },
    imgText: {
        color: colors.crimson,
        fontSize: 50,
        fontWeight: '900',
    },
    textContainer1: {
        backgroundColor: colors.aqua,
        flex: 1,
        paddingTop: 20,
    },
    textContainer2: {
        backgroundColor: colors.bestBuyYellow,
        flex: 2,
        paddingTop: 20,
    },
    textContainer3: {
        backgroundColor: colors.crimson,
        flex: 3,
        paddingTop: 20,
    },
    smallText: {
        fontSize: 12,
        fontWeight: '100',
    },
    mediumText: {
        fontSize: 20,
        fontWeight: '400',
    },
    largeText: {
        fontSize: 40,
        fontWeight: '800',
    },
});