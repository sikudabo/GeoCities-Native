import Svg, { Path } from 'react-native-svg';
import { colors } from './colors';
import { GeoCitiesLogoProps } from './GeoCitiesLogo';

export default function GeoCitiesCommentIconOutlined({
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
                d="M6 14h12v-2H6zm0-3h12V9H6zm0-3h12V6H6zm16 14l-4-4H4q-.825 0-1.412-.587T2 16V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4zM4 16h14.85L20 17.125V4H4zm0 0V4z"
            />
        </Svg>
    );
}