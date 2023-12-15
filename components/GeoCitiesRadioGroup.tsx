import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { RadioButton, Text } from 'react-native-paper';
import { colors } from './colors';

export default function GeoCitiesRadioGroup() {
    const [gender, toggleGender] = useState('female');

    function handleGenderChange(gender: string) {
        toggleGender(gender);
    }

    return (
        <RadioButton.Group onValueChange={handleGenderChange} value={gender}>
            <Text onPress={() => handleGenderChange('female')} style={styles.text}>
                Female
            </Text>
            <RadioButton.IOS color={colors.coolBlue} value="female" />
            <Text onPress={() => handleGenderChange('male')} style={styles.text}>
                Male
            </Text>
            <RadioButton.IOS color={colors.coolBlue} value="male" />
        </RadioButton.Group>
    )
}

const styles = StyleSheet.create({
    text: {
        color: colors.black,
        fontFamily: 'Montserrat_400Regular',
        fontSize: 24,
        fontWeight: '900',
    }
});
