import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import GeoCitiesAvatar from '../GeoCitiesAvatar';
import GeoCitiesBodyText from '../GeoCitiesBodyText';
import GeoCitiesCaptionText from '../GeoCitiesCaptionText';
import { colors } from '../colors';
import { CommentType } from '../../typings';
import { postTimeDifference } from '../../utils/helpers';

type CommentCardProps = {
    comment: CommentType;
};

type DataLayerProps = CommentCardProps;

type CommentCardDisplayLayerProps = {
    avatarUri: string;
    caption?: string;
    commentType: 'video' | 'photo' | 'link' | 'text';
    createdAt: number;
    hashTags?: Array<string>;
    link?: string;
    userName: string;
}

export default function CommentCard({ comment }: CommentCardProps) {
    return <CommentCard_DisplayLayer {...useDataLayer({ comment })} />;
}

function CommentCard_DisplayLayer({
    avatarUri,
    caption,
    commentType,
    createdAt,
    hashTags = [],
    link,
    userName,
}: CommentCardDisplayLayerProps) {
    return (
        <Surface elevation={4} style={styles.cardContainer}>
            <View style={styles.topCardSection}>
                <GeoCitiesAvatar size={50} src={avatarUri} />
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
                            <GeoCitiesCaptionText hashTags={hashTags as Array<string>} text={caption} />
                        </ScrollView>
                    </SafeAreaView>
                </View>
            )}
            {commentType === 'link' && link && (
                <View style={styles.linkPreviewContainer}>
                    <LinkPreview 
                        containerStyle={{  width: '100%', padding: 0 }}
                        renderDescription={(text) => (
                            <View style={styles.linkPreviewTextContainer}>
                                <GeoCitiesCaptionText hashTags={[]} text={text} />
                            </View>
                        )}
                        renderText={(text) => (
                            <View style={styles.linkPreviewTextContainer}>
                                <GeoCitiesCaptionText hashTags={[]} text={text} />
                            </View>
                        )}
                        renderTitle={(text) => (
                            <View style={[styles.linkPreviewTextContainer, styles.linkPreviewTitle]}>
                                <GeoCitiesCaptionText hashTags={[]} text={text} />
                            </View>
                        )}
                        text={link}
                        textContainerStyle={{ padding: 0 }}
                     />
                </View>
            )}
        </Surface>
    );
}

function useDataLayer({ comment }: DataLayerProps) {
    const { authorId, caption, commentType, createdAt, hashTags, link, userName } = comment;
    const avatarUri = `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo-by-user-id/${authorId}`;
    return {
      avatarUri,
      caption,
      commentType,
      createdAt,
      hashTags,
      link,
      userName,
    };
}

const styles = StyleSheet.create({
    captionSection: {
        height: 100,
        paddingTop: 20,
    },
    cardContainer: {
        borderTopColor: colors.white,
        borderStyle: 'solid',
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
    },
    linkPreviewContainer: {
        paddingBottom: 10,
    },
    linkPreviewTextContainer: {
        width: '100%',
    },
    linkPreviewTitle: {
        paddingBottom: 20,
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