import { StyleSheet, View } from 'react-native';
import truncate from 'lodash/truncate';
import { Surface } from "react-native-paper";
import GeoCitiesAvatar from '../GeoCitiesAvatar';
import GeoCitiesBodyText from '../GeoCitiesBodyText';
import { colors } from '../colors';
import { PostType } from '../../typings';

type DataLayerProps = {
    post: PostType;
};

type PostCardDisplayLayerProps = {
    authorId: string;
    caption: string | undefined;
    userName: string;
};

export default function PostCard({ post }: { post: PostType}) {
    const { caption } = post;
    console.log('The caption is:', caption);
    return <PostCard_DisplayLayer {...useDataLayer({ post })} />;
}

function PostCard_DisplayLayer({
    authorId,
    caption,
    userName,
}: PostCardDisplayLayerProps) {
    return (
        <Surface style={styles.cardContainer}>
            <View style={styles.topCardSection}>
                <GeoCitiesAvatar size={50} src={`${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo-by-user-id/${authorId}`} />
                <View style={styles.topSectionNameContainer}>
                    <GeoCitiesBodyText color={colors.white} fontSize={14} fontWeight={900} text={userName} />
                </View>
            </View>
        </Surface>
    )
}

function useDataLayer({ post }: DataLayerProps) {
    const { authorId, caption, userName } = post;
    
    return {
        authorId,
        caption,
        userName: truncate(userName, { length: 30 }),
    };
}

const styles = StyleSheet.create({
    cardContainer: {
        boarderRadius: 5,
        marginBottom: 20,
    },
    topCardSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        lineHeight: '1',
        paddingLeft: 5,
        paddingTop: 10,
        width: '100%',
    },
    topSectionNameContainer: {
        paddingLeft: 10,
        paddingTop: 10,
    },
});

