import Svg, { Path } from 'react-native-svg';
import { colors } from './colors';
import { GeoCitiesLogoProps } from './GeoCitiesLogo';

export default function GeoCitiesDeleteIcon({
    color = colors.white,
    height = 100,
    onPress = () => {},
    width = 100,
}: GeoCitiesLogoProps) {
    return (
        <Svg
            onPress={onPress}
            height={height}
            width={width}
            viewBox="0 0 24 24"
        >
            <Path 
                fill={color} 
                d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"
            />
        </Svg>
    );
}