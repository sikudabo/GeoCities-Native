import Svg, { Path } from 'react-native-svg';
import { colors } from './colors';
import { GeoCitiesLogoProps } from './GeoCitiesLogo';

export default function GeoCitiesBackArrowIcon({
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
                d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z"
            />
        </Svg>
    );
}