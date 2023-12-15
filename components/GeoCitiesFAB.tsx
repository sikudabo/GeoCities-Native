import { StyleSheet } from 'react-native';
import { FAB, FABProps } from "react-native-paper";
import { colors } from './colors';

type GeoCitiesFABProps = Omit<FABProps, 'children'> & {
    backgroundColor?: string;
    color?: string;
    customStyles?: any;
    text?: string;
};


export default function GeoCitiesFAB({
    backgroundColor = colors.geoCitiesGreen,
    color = colors.white,
    customStyles = {},
    text
}: GeoCitiesFABProps) {
    
    const styles = StyleSheet.create({
        fabStyles: {
            backgroundColor: backgroundColor,
            borderRadius: 50,
            ...customStyles,
        }
    });

    return (
        <FAB 
            color={color}
            customSize={70}
            icon="plus"
            label={text}
            mode="elevated"
            rippleColor='rgba(255, 255, 255, 0)'
            style={styles.fabStyles}
            uppercase={false}
        />
    );
}