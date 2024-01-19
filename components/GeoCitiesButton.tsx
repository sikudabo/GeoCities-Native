import { StyleSheet } from 'react-native';
import { Button, ButtonProps } from 'react-native-paper';
import { colors } from './colors';

type GeoCitiesButtonProps = Omit<ButtonProps, 'children'> & {
    customStyle?: any;
    fontWeight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | undefined
    text: string;
};

export default function GeoCitiesButton({
    buttonColor = colors.geoCitiesGreen,
    fontWeight,
    mode = 'contained',
    customStyle = {},
    text,
    textColor = colors.white,
    ...props
}: GeoCitiesButtonProps) {
    const styles = StyleSheet.create({
        buttonStyles: {
            backgroundColor: mode === 'contained' ? buttonColor : 'rgba(255, 255, 255, 0)',
            borderColor: mode === 'outlined' || mode ==='contained' ? buttonColor : 'rgba(255, 255, 255, 0)',
            borderWidth: mode === 'outlined' ? 2 : 0,
            borderRadius: 5,
            fontFamily: 'Montserrat_700Bold',
            fontWeight: fontWeight ? fontWeight : 'normal',
            ...customStyle,
        }
    })
    return (
        <Button elevation={0} mode={mode} rippleColor='rgba(255, 255, 255, 0.0)' style={styles.buttonStyles} textColor={mode === 'outlined' || mode === 'text' ? buttonColor : buttonColor === colors.white || buttonColor === colors.cream ? colors.black : colors.white} uppercase={false} {...props}>
            {text}
        </Button>
    );
}