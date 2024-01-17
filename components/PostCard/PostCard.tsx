import { StyleSheet } from 'react-native';
import { Surface } from "react-native-paper";
import GeoCitiesBodyText from '../GeoCitiesBodyText';
import { colors } from '../colors';
import { PostType } from '../../typings';

type DataLayerProps = {
    post: PostType;
};

type PostCardDisplayLayerProps = {
    caption: string | undefined;
};

export default function PostCard({ post }: { post: PostType}) {
    const { caption } = post;
    console.log('The caption is:', caption);
    return <PostCard_DisplayLayer {...useDataLayer({ post })} />;
}

function PostCard_DisplayLayer({
    caption,
}: PostCardDisplayLayerProps) {
    return (
        <Surface style={styles.cardContainer}>
            {caption && (
                <GeoCitiesBodyText color={colors.white} text={caption} />
            )}
        </Surface>
    )
}

function useDataLayer({ post }: DataLayerProps) {
    const { caption } = post;
    
    return {
        caption,
    };
}

const styles = StyleSheet.create({
    cardContainer: {
        boarderRadius: 5,
        marginBottom: 20,
    },
});

