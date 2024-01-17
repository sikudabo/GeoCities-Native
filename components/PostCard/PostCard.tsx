import { StyleSheet, View } from 'react-native';
import truncate from 'lodash/truncate';
import { Surface } from "react-native-paper";
import GeoCitiesAvatar from '../GeoCitiesAvatar';
import GeoCitiesBodyText from '../GeoCitiesBodyText';
import { colors } from '../colors';
import { PostType } from '../../typings';
import { postTimeDifference } from '../../utils/helpers';

type DataLayerProps = {
    post: PostType;
};

type PostCardDisplayLayerProps = {
    authorId: string;
    caption: string | undefined;
    createdAt: number;
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
    createdAt,
    userName,
}: PostCardDisplayLayerProps) {
    return (
        <Surface elevation={4} style={styles.cardContainer}>
            <View style={styles.topCardSection}>
                <GeoCitiesAvatar size={50} src={`${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo-by-user-id/${authorId}`} />
                <View style={styles.topSectionNameContainer}>
                    <GeoCitiesBodyText color={colors.white} fontSize={14} fontWeight={900} text={userName} />
                </View>
                <View style={styles.topSectionDateContainer}>
                    <GeoCitiesBodyText color={colors.white} fontSize={14} text={postTimeDifference(createdAt)} />
                </View>
            </View>
        </Surface>
    );
}

function useDataLayer({ post }: DataLayerProps) {
    const { authorId, caption, createdAt, userName } = post;
    
    return {
        authorId,
        caption,
        createdAt,
        userName: truncate(userName, { length: 30 }),
    };
}

const styles = StyleSheet.create({
    cardContainer: {
        boarderRadius: 5,
        marginBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },
    topCardSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        lineHeight: '1',
        paddingTop: 10,
        width: '100%',
    },
    topSectionDateContainer: {
        marginLeft: 'auto',
        paddingTop: 10,
    },
    topSectionNameContainer: {
        paddingLeft: 10,
        paddingTop: 10,
    },
});

