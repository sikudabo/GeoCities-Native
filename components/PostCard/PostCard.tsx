import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import truncate from 'lodash/truncate';
import { Surface } from "react-native-paper";
import GeoCitiesAvatar from '../GeoCitiesAvatar';
import GeoCitiesBodyText from '../GeoCitiesBodyText';
import GeoCitiesCaptionText from '../GeoCitiesCaptionText';
import { colors } from '../colors';
import { PostType } from '../../typings';
import { captionHashtagFormatter, postTimeDifference } from '../../utils/helpers';

type DataLayerProps = {
    post: PostType;
};

type PostCardDisplayLayerProps = {
    authorId: string;
    caption: string | undefined;
    createdAt: number;
    hashTags: Array<string> | undefined;
    userName: string;
};

export default function PostCard({ post }: { post: PostType}) {
    return <PostCard_DisplayLayer {...useDataLayer({ post })} />;
}

function PostCard_DisplayLayer({
    authorId,
    caption,
    createdAt,
    hashTags,
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
            {caption && (
                <View style={styles.captionSection}>
                    <SafeAreaView>
                        <ScrollView>
                            {/* <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight={500} text={caption} /> */}
                            <GeoCitiesCaptionText hashTags={hashTags as Array<string>} text={caption} />
                        </ScrollView>
                    </SafeAreaView>
                </View>
            )}
        </Surface>
    );
}

function useDataLayer({ post }: DataLayerProps) {
    const { authorId, caption, createdAt, hashTags, userName } = post;
    
    return {
        authorId,
        caption,
        createdAt,
        hashTags,
        userName: truncate(userName, { length: 30 }),
    };
}

const styles = StyleSheet.create({
    captionSection: {
        height: 100,
        paddingTop: 20,
    },
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

