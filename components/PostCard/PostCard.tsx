import { useRef } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import truncate from 'lodash/truncate';
import millify from 'millify';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { Surface } from "react-native-paper";
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import { Video } from 'expo-av';
import * as Linking from 'expo-linking';
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
import { deleteData, postNonBinaryData } from '../../utils/requests';
import { useShowDialog, useShowLoader } from '../../hooks';

type DataLayerProps = {
    post: PostType;
    renderedFrom?: string;
};

type PostCardDisplayLayerProps = {
    authorId: string;
    caption: string | undefined;
    createdAt: number;
    deletePost: () => void;
    groupName?: string;
    handleAddCommentButtonClick: () => void;
    handleLikeButtonPress: () => void;
    handleCommentButtonClick: () => void;
    hashTags: Array<string> | undefined;
    hasCommented: boolean;
    hasLikedPost: boolean;
    isCommentsScreen?: boolean;
    isPostAuthor: boolean;
    link?: string;
    navigateToGroup: () => void;
    navigateToProfile: () => void;
    numberOfComments: number;
    numberOfLikes: number;
    openUrl: () => void;
    postMediaId: string | undefined;
    postType: 'video' | 'photo' | 'link' | 'text';
    postOriginType: 'profile' | 'community';
    userName: string;
    videoRef: any;
};

export default function PostCard({ post, isCommentsScreen = false, renderedFrom = 'profile' }: { post: PostType; isCommentsScreen?: boolean; renderedFrom?: string; }) {
    return <PostCard_DisplayLayer isCommentsScreen={isCommentsScreen} {...useDataLayer({ post, renderedFrom })} />;
}

function PostCard_DisplayLayer({
    authorId,
    caption,
    createdAt,
    deletePost,
    groupName,
    handleAddCommentButtonClick,
    handleLikeButtonPress,
    handleCommentButtonClick,
    hashTags,
    hasCommented,
    hasLikedPost,
    isCommentsScreen = false,
    isPostAuthor,
    link,
    navigateToGroup,
    navigateToProfile,
    numberOfComments,
    numberOfLikes,
    openUrl,
    postMediaId,
    postType,
    postOriginType,
    userName,
    videoRef,
}: PostCardDisplayLayerProps) {

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
            marginBottom: isCommentsScreen ? 0 : 20,
            paddingLeft: 10,
            paddingRight: 10,
        },
        groupNameContainer: {
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
    return (
        <Surface elevation={4} style={styles.cardContainer}>
            <View style={styles.topCardSection}>
                <TouchableOpacity onPress={postOriginType === 'profile' ? navigateToProfile : navigateToGroup}>
                    <GeoCitiesAvatar size={50} src={`${process.env.EXPO_PUBLIC_API_BASE_URI}${postOriginType === 'profile' ? `get-photo-by-user-id/${authorId}` : `get-avatar-by-group-name/${groupName}`}`} />
                </TouchableOpacity>
                <View style={styles.topSectionNameContainer}>
                    {postOriginType === 'community' && (
                        <TouchableOpacity onPress={navigateToGroup} style={styles.groupNameContainer}>
                            <GeoCitiesBodyText color={colors.white} fontSize={14} fontWeight={900} text={groupName as string} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={navigateToProfile}>
                        <GeoCitiesBodyText color={colors.white} fontSize={14} fontWeight={900} text={userName} />
                    </TouchableOpacity>
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
            {(postType === 'photo' || postType === 'video') && link && (
                <TouchableOpacity onPress={openUrl} style={styles.mediaPostLinkSection}>
                    <GeoCitiesCaptionText hashTags={[]} text={link} />
                </TouchableOpacity>
            )}
            {postType === 'photo' && postMediaId && (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${postMediaId}`}} style={styles.img} />
                </View>
            )}
            {postType === 'video' && postMediaId && (
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
                    {!hasLikedPost ? (
                        <GeoCitiesLikeIconOutlined height={20} width={20} />
                    ): <GeoCitiesLikeIconFilled height={20} width={20} />}
                    <View style={styles.actionNumberIndicatorContainer}>
                        <GeoCitiesBodyText color={colors.white} fontSize={14} fontWeight={900} text={millify(numberOfLikes)} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={isCommentsScreen ? handleAddCommentButtonClick : handleCommentButtonClick} style={styles.buttonsTouchContainer}>
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
                    <TouchableOpacity onPress={deletePost} style={styles.buttonsTouchContainer}>
                        <GeoCitiesDeleteIcon color={colors.salmonPink} height={20} width={20} />
                    </TouchableOpacity>
                )}
            </View>
        </Surface>
    );
}

function useDataLayer({ post, renderedFrom }: DataLayerProps) {
    const queryClient = useQueryClient();
    const navigation: any = useNavigation();
    const { authorId, caption, comments, createdAt, groupName, hashTags, _id: postId, likes, link, postMediaId, postOriginType, postType, userName } = post;
    const { user } = useUser();
    const { _id } = user;
    const commentUser = comments.find((user) => user.authorId === _id);
    const hasCommented = commentUser ? true : false;
    const isPostAuthor = authorId === _id ? true : false;
    const numberOfComments = comments.length;
    const numberOfLikes = likes.length;
    const videoRef: any = useRef(null);
    const { setIsLoading } = useShowLoader();
    const { handleDialogMessageChange, setDialogMessage, setDialogTitle, setIsError } = useShowDialog();

    function navigateToProfile() {
        navigation.navigate('Profile', { isVisitor: !isPostAuthor, userId: !isPostAuthor ? authorId : undefined });
        return;
    }

    function navigateToGroup() {
        navigation.navigate('GroupScreen', { group: { groupName }});
        return;
    }

    async function deletePost() {
        setIsLoading(true);
        if (postType === 'video' || postType === 'photo') {
            await deleteData({
                data: {
                    postId,
                    fileId: postMediaId,
                },
                uri: 'delete-binary-post',
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
                console.log(`There was an error deleting a binary post: ${err.message}`);
                setIsLoading(false);
                setIsLoading(false);
                setIsError(true);
                setDialogTitle('Whoops');
                setDialogMessage(`There was an error deleting this post. Please try again!`);
                handleDialogMessageChange(true);
                return;
            });
        }

        await deleteData({
            data: {
                postId,
            },
            uri: 'delete-nonbinary-post',
        }).then(res => {
            const { isError, message } = res;

            if (isError) {
                setIsLoading(false);
                setIsError(true);
                setDialogTitle('Whoops');
                setDialogMessage(message);
                handleDialogMessageChange(true);
            }

            setIsLoading(false);
            queryClient.invalidateQueries(['fetchProfilePosts']);
            queryClient.invalidateQueries(['fetchPost']);
        }).catch(err => {
            console.log(`There was an error deleting a non-binary post: ${err.message}`);
            setIsLoading(false);
            setIsLoading(false);
            setIsError(true);
            setDialogTitle('Whoops');
            setDialogMessage(`There was an error deleting this post. Please try again!`);
            handleDialogMessageChange(true);
        });
    }

    function handleCommentButtonClick() {
        navigation.navigate('PostComments', { _id: postId, renderedFrom, groupName });
    }

    function handleAddCommentButtonClick() {
        navigation.navigate('CreatePost', { groupName, isCommunity: postOriginType === 'community' ? true : false, isCommentsScreen: true, post, renderedFrom });
    }

    function hasLikedPost() {
        if (typeof likes !== 'undefined' && likes.length > 0) {
            if (likes.includes(_id)) {
                return true;
            }
            return false;
        }

        return false;
    }

    function openUrl() {
        if(link) {
            Linking.openURL(link);
        }
    }

    async function handleLikeButtonPress() {
        setIsLoading(true);
        const alreadyLiked = hasLikedPost();

        await postNonBinaryData({
            data: {
                actionType: alreadyLiked ? 'unlike' : 'like',
                authorId,
                likerId: _id,
                postId,
            },
            uri: 'add-subtract-like',
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
            queryClient.invalidateQueries(['fetchFeedPosts']);
            setIsLoading(false);
        }).catch(err => {
            console.log(`There was an error ${alreadyLiked ? 'unliking' : 'liking'} a post: ${err.message}`);
            setIsLoading(false);
            setIsError(true);
            setDialogTitle('Whoops');
            setDialogMessage(`There was an error ${alreadyLiked ? 'unliking' : 'liking'} a post. Please try again!`);
            handleDialogMessageChange(true);
        });
    }
    
    return {
        authorId,
        caption,
        createdAt,
        deletePost,
        groupName,
        handleAddCommentButtonClick,
        handleLikeButtonPress,
        handleCommentButtonClick,
        hashTags,
        hasCommented,
        hasLikedPost: hasLikedPost(),
        isPostAuthor,
        link,
        navigateToGroup,
        navigateToProfile,
        numberOfComments,
        numberOfLikes,
        openUrl,
        postMediaId,
        postType,
        postOriginType,
        userName: truncate(userName, { length: 30 }),
        videoRef,
    };
}