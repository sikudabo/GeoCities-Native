import { StyleSheet, Text } from 'react-native';
import { colors } from './colors';

type GeoCitiesBodyTextProps = {
    color?: string;
    fontSize?: number;
    fontWeight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | number | undefined;
    text: string;
    textAlign?: "left" | "auto" | "right" | "center" | "justify" | undefined;
};

export default function GeoCitiesBodyText({
    color = colors.black,
    fontSize = 20,
    fontWeight = 'normal',
    text,
    textAlign = 'left',
}: GeoCitiesBodyTextProps) {
    const styles = StyleSheet.create({
        textStyles: {
            color,
            fontFamily: 'Montserrat_600SemiBold',
            fontSize,
            fontWeight: fontWeight.toString() as any,
            textAlign,
        },
    });

    return (
        <Text style={styles.textStyles}>
            {text}
        </Text>
    );
}