import Svg, { Path } from 'react-native-svg';
import { colors } from './colors';
import { GeoCitiesLogoProps } from './GeoCitiesLogo';

export default function GeoCitiesPhotoIcon({
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
            viewBox="0 0 56 56"
        >
            <Path fill={color} 
                d="M7.715 49.574h40.57c4.899 0 7.36-2.437 7.36-7.265V13.69c0-4.828-2.461-7.265-7.36-7.265H7.715C2.84 6.426.355 8.84.355 13.69v28.62c0 4.851 2.485 7.265 7.36 7.265m31.57-21.633c-1.055-.937-2.25-1.43-3.515-1.43c-1.313 0-2.462.446-3.54 1.407l-10.593 9.469l-4.336-3.938c-.985-.867-2.04-1.336-3.164-1.336c-1.032 0-2.04.446-3 1.313L4.129 39.73V13.88c0-2.438 1.312-3.68 3.656-3.68h40.43c2.32 0 3.656 1.242 3.656 3.68v25.875Zm-21.469.258c3.024 0 5.508-2.484 5.508-5.531c0-3.023-2.484-5.531-5.508-5.531c-3.046 0-5.53 2.508-5.53 5.531a5.541 5.541 0 0 0 5.53 5.531"
            />
        </Svg>
    );
}