import Svg, { Path } from 'react-native-svg';
import { colors } from './colors';
import { GeoCitiesLogoProps } from './GeoCitiesLogo';

export default function GeoCitiesLikeIconOutlined({
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
            viewBox="0 0 48 48"
        >
            <Path
                fill="none"
                stroke={colors.white} 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="4" 
                d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8"
            />
        </Svg>
    );
}