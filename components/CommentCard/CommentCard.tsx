import { useRef } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import millify from 'millify';
import { useQueryClient } from '@tanstack/react-query';
import { Surface } from 'react-native-paper';
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import { Video } from 'expo-av';
import * as Linking from 'expo-linking';
import GeoCitiesAvatar from '../GeoCitiesAvatar';
import GeoCitiesBodyText from '../GeoCitiesBodyText';
import GeoCitiesCaptionText from '../GeoCitiesCaptionText';
import GeoCitiesDeleteIcon from '../GeoCitiesDeleteIcon';
import GeoCitiesLikeIconFilled from '../GeoCitiesLikeIconFilled';
import GeoCitiesLikeIconOutlined from '../GeoCitiesLikeIconOutlined';
import { colors } from '../colors';
import { CommentType } from '../../typings';
import { postTimeDifference } from '../../utils/helpers';
import { useUser } from '../../hooks/storage-hooks';
import { useShowDialog, useShowLoader } from '../../hooks';
import { deleteData, postNonBinaryData } from '../../utils/requests';

type CommentCardProps = {
    comment: CommentType;
};

type DataLayerProps = CommentCardProps;

type CommentCardDisplayLayerProps = {
    avatarUri: string;
    canDeleteComment: boolean;
    caption?: string;
    commentType: 'video' | 'photo' | 'link' | 'text';
    createdAt: number;
    deleteComment: () => void;
    handleLikeButtonPress: () => void;
    hashTags?: Array<string>;
    hasLikedComment: boolean;
    link?: string;
    numberOfLikes: number;
    openUrl: () => void;
    postMediaId?: string;
    userName: string;
    videoRef: any;
}

export default function CommentCard({ comment }: CommentCardProps) {
    return <CommentCard_DisplayLayer {...useDataLayer({ comment })} />;
}

function CommentCard_DisplayLayer({
    avatarUri,
    canDeleteComment,
    caption,
    commentType,
    createdAt,
    deleteComment,
    handleLikeButtonPress,
    hashTags = [],
    hasLikedComment,
    link,
    numberOfLikes,
    openUrl,
    postMediaId,
    userName,
    videoRef,
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
            {(commentType === 'photo' || commentType === 'video') && link && (
                <TouchableOpacity onPress={openUrl} style={styles.mediaPostLinkSection}>
                    <GeoCitiesCaptionText hashTags={[]} text={link} />
                </TouchableOpacity>
            )}
             {commentType === 'photo' && postMediaId && (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${postMediaId}`}} style={styles.img} />
                </View>
            )}
            {commentType === 'video' && postMediaId && (
                <View style={styles.videoContainer}>
                    <Video 
                        ref={videoRef}
                        source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URI}get-video/${postMediaId}` }}
                        style={styles.videoPlayer}
                        isLooping
                        isMuted
                        shouldPlay
                        useNativeControls
                    />
                </View>
            )}
            <View style={styles.actionButtonsSection}>
                <TouchableOpacity onPress={handleLikeButtonPress} style={styles.buttonsTouchContainer}>
                    {hasLikedComment ? (
                        <GeoCitiesLikeIconFilled height={20} width={20} />
                    ): (
                        <GeoCitiesLikeIconOutlined height={20} width={20} />
                    )}
                     <View style={styles.actionNumberIndicatorContainer}>
                        <GeoCitiesBodyText color={colors.white} fontSize={14} fontWeight={900} text={millify(numberOfLikes)} />
                    </View>
                </TouchableOpacity>
                {canDeleteComment && (
                    <TouchableOpacity onPress={deleteComment} style={styles.buttonsTouchContainer}>
                    <GeoCitiesDeleteIcon color={colors.salmonPink} height={20} width={20} />
                </TouchableOpacity>
                )}
            </View>
        </Surface>
    );
}

function useDataLayer({ comment }: DataLayerProps) {
    const queryClient = useQueryClient();
    const { setIsLoading } = useShowLoader();
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError } = useShowDialog();
    const { user } = useUser();
    const { _id } = user;
    const { authorId, caption, commentType, createdAt, hashTags, _id: commentId, likes, link, postAuthorId, postId, postMediaId, userName } = comment;
    const avatarUri = `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo-by-user-id/${authorId}`;
    const canDeleteComment = _id === authorId || _id === postAuthorId ? true : false;
    const numberOfLikes = typeof likes !== 'undefined' ? likes.length : 0;
    const videoRef: any = useRef(null);

    function hasLikedComment() {
        if (typeof likes !== 'undefined' && likes.length > 0) {
            if (likes.includes(_id)) {
                return true;
            }
            return false;
        }

        return false;
    }

    async function deleteComment() {
        setIsLoading(true);

        if (commentType === 'text' || commentType === 'link') {
            await deleteData({
                data: {
                    commentId,
                    postId,
                },
                uri: 'delete-nonbinary-comment',
            }).then(res => {
                const { isError, message } = res;

                if (isError) {
                    setIsLoading(false);
                    setIsError(true);
                    setDialogTitle('Whoops');
                    setDialogMessage(message);
                    handleDialogMessageChange(true);
                    return;
                }

                setIsLoading(false);
                queryClient.invalidateQueries(['fetchProfilePosts']);
                queryClient.invalidateQueries(['fetchPost']);
                return;
            }).catch(err => {
                console.log(`There was an error deleting non-binary comment: ${err.message}`);
                setIsLoading(false);
                setIsLoading(false);
                setIsError(true);
                setDialogTitle('Whoops');
                setDialogMessage(`There was an error deleting this comment. Please try again!`);
                handleDialogMessageChange(true);
                return;
            });
        }

        setIsLoading(false);
        return;
    }

    async function handleLikeButtonPress() {
        setIsLoading(true);
        const isLiked = hasLikedComment();
        await postNonBinaryData({
            data: {
                actionType: isLiked ? 'unlike' : 'like',
                authorId,
                commentId,
                likerId: _id,
                postId,
            },
            uri: 'add-subtract-like-comment',
        }).then(res => {
            const { isError, message } = res;

            if (isError) {
                setIsLoading(false);
                setIsError(true);
                setDialogTitle('Whoops');
                setDialogMessage(message);
                handleDialogMessageChange(true);
            }
            queryClient.invalidateQueries(['fetchUser']);
            queryClient.invalidateQueries(['fetchProfilePosts']);
            queryClient.invalidateQueries(['fetchPost']);
            setIsLoading(false);
        }).catch(err => {
            console.log(`There was an error ${isLiked ? 'unliking' : 'liking'} a comment: ${err.message}`);
            setIsLoading(false);
            setIsError(true);
            setDialogTitle('Whoops');
            setDialogMessage(`There was an error ${isLiked ? 'unliking' : 'liking'} a comment. Please try again!`);
            handleDialogMessageChange(true);
        });
    }

    function openUrl() {
        if(link) {
            Linking.openURL(link);
        }
    }

    return {
      avatarUri,
      canDeleteComment,
      caption,
      commentType,
      createdAt,
      deleteComment,
      handleLikeButtonPress,
      hashTags,
      hasLikedComment: hasLikedComment(),
      link,
      numberOfLikes,
      openUrl,
      postMediaId,
      userName,
      videoRef,
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
        borderTopColor: colors.white,
        borderStyle: 'solid',
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
    },
    imageContainer: {
        paddingTop: 20,
        paddingBottom: 20,
    },
    img: {
        height: 400,
        width: '100%',
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
    mediaPostLinkSection: {
        paddingTop: 10,
        paddingBottom: 10,
        width: '100%',
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
    videoContainer: {
        paddingBottom: 20,
        paddingTop: 10,
        height: 350,
        width: '100%',
    },
    videoPlayer: {
        height: '100%',
        width: '100%',
    },
});