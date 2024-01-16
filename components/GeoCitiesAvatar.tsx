import { Avatar } from "react-native-paper";

type GeoCitiesAvatarProps = {
    src: any;
    size?: number;
}

export default function GeoCitiesAvatar({
    src,
    size = 20,
}: GeoCitiesAvatarProps) {
    return (
        <Avatar.Image source={{ uri: src }} size={size} />
    );
}