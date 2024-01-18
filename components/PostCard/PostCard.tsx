import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import truncate from 'lodash/truncate';
import millify from 'millify';
import { Surface } from "react-native-paper";
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import GeoCitiesAvatar from '../GeoCitiesAvatar';
import GeoCitiesBodyText from '../GeoCitiesBodyText';
import GeoCitiesCaptionText from '../GeoCitiesCaptionText';
import GeoCitiesCommentIconFilled from '../GeoCitiesCommentIconFilled';
import GeoCitiesCommentIconOutlined from '../GeoCitiesCommentIconOutlined';
import GeoCitiesDeleteIcon from '../GeoCitiesDeleteIcon';
import GeoCitiesLikeIconFilled from '../GeoCitiesLikeIconFilled';
import GeoCitiesLikeIconOutlined from '../GeoCitiesLikeIconOutlined';
import { useUser } from '../../hooks/storage-hooks';
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
    hashTags: Array<string> | undefined;
    hasCommented: boolean;
    hasLikedPost: boolean;
    isPostAuthor: boolean;
    link?: string;
    numberOfComments: number;
    numberOfLikes: number;
    postType: 'video' | 'photo' | 'link' | 'text';
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
    hasCommented,
    hasLikedPost,
    isPostAuthor,
    link,
    numberOfComments,
    numberOfLikes,
    postType,
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
                            <GeoCitiesCaptionText hashTags={hashTags as Array<string>} text={caption} />
                        </ScrollView>
                    </SafeAreaView>
                </View>
            )}
            {postType === 'link' && link && (
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
            <View style={styles.actionButtonsSection}>
                <TouchableOpacity style={styles.buttonsTouchContainer}>
                    {!hasLikedPost ? (
                        <GeoCitiesLikeIconOutlined height={20} width={20} />
                    ): <GeoCitiesLikeIconFilled height={20} width={20} />}
                    <View style={styles.actionNumberIndicatorContainer}>
                        <GeoCitiesBodyText color={colors.white} fontSize={14} fontWeight={900} text={millify(numberOfLikes)} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonsTouchContainer}>
                    {!hasCommented ? (
                        <GeoCitiesCommentIconOutlined height={20} width={20} />
                    ): (
                        <GeoCitiesCommentIconFilled color={colors.salmonPink} height={20} width={20} />
                    )}
                    <View style={styles.actionNumberIndicatorContainer}>
                        <GeoCitiesBodyText color={colors.white} fontSize={14} fontWeight={900} text={millify(numberOfComments)} />
                    </View>
                </TouchableOpacity>
                {isPostAuthor && (
                    <TouchableOpacity style={styles.buttonsTouchContainer}>
                        <GeoCitiesDeleteIcon color={colors.salmonPink} height={20} width={20} />
                    </TouchableOpacity>
                )}
            </View>
        </Surface>
    );
}

function useDataLayer({ post }: DataLayerProps) {
    const { authorId, caption, comments, createdAt, hashTags, likes, link, postType, userName } = post;
    const { user } = useUser();
    const { _id } = user;
    const commentUser = comments.find((user) => user.authorId === _id);
    const hasCommented = commentUser ? true : false;
    const isPostAuthor = authorId === _id ? true : false;
    const numberOfComments = comments.length;
    const numberOfLikes = likes.length;

    function hasLikedPost() {
        if (typeof likes !== 'undefined' && likes.length > 0) {
            if (likes.includes(_id)) {
                return true;
            }
            return false;
        }

        return false;
    }
    
    return {
        authorId,
        caption,
        createdAt,
        hashTags,
        hasCommented,
        hasLikedPost: hasLikedPost(),
        isPostAuthor,
        link,
        numberOfComments,
        numberOfLikes,
        postType,
        userName: truncate(userName, { length: 30 }),
    };
}

const styles = StyleSheet.create({
    actionButtonsSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    actionNumberIndicatorContainer: {
        paddingTop: 2,
    },
    buttonsTouchContainer: {
        columnGap: 5,
        display: 'flex',
        flexDirection: 'row',
        height: 30,
        width: 50,
    },
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