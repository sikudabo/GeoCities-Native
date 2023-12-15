import { StyleSheet } from 'react-native';
import { IconButton, IconButtonProps } from "react-native-paper";
import { colors } from './colors';

type GeoCitiesIconButtonProps = IconButtonProps & {
    backgroundColor?: string;
    buttonSize?: number;
    mode?: 'contained' | 'contained-tonal' | 'outlined';
};

export default function GeoCitiesIconButton({
    backgroundColor = colors.coolBlue,
    buttonSize = 50,
    mode = 'contained'
}: GeoCitiesIconButtonProps) {
    const styles = StyleSheet.create({
        iconButtonStyles: {
            borderColor: mode === 'outlined' ? backgroundColor : 'rgba(255, 255, 255, 0)',
            backgroundColor: 'rgba(255, 255, 255, 0)',
        },
    });
    return (
        <IconButton 
            iconColor={backgroundColor}
            icon="camera"
            mode={mode}
            size={buttonSize}
            style={styles.iconButtonStyles}
        />
    )
}