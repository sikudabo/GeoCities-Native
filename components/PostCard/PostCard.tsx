import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import truncate from 'lodash/truncate';
import millify from 'millify';
import { Surface } from "react-native-paper";
import GeoCitiesAvatar from '../GeoCitiesAvatar';
import GeoCitiesBodyText from '../GeoCitiesBodyText';
import GeoCitiesCaptionText from '../GeoCitiesCaptionText';
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
    hasLikedPost: boolean;
    numberOfLikes: number;
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
    hasLikedPost,
    numberOfLikes,
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
            <View style={styles.actionButtonsSection}>
                <TouchableOpacity style={styles.buttonsTouchContainer}>
                    {!hasLikedPost ? (
                        <GeoCitiesLikeIconOutlined height={20} width={20} />
                    ): <GeoCitiesLikeIconFilled height={20} width={20} />}
                    <View style={styles.actionNumberIndicatorContainer}>
                        <GeoCitiesBodyText color={colors.white} fontSize={14} fontWeight={900} text={millify(numberOfLikes)} />
                    </View>
                </TouchableOpacity>
            </View>
        </Surface>
    );
}

function useDataLayer({ post }: DataLayerProps) {
    const { authorId, caption, createdAt, hashTags, likes, userName } = post;
    const { user } = useUser();
    const { _id } = user;
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
        hasLikedPost: hasLikedPost(),
        numberOfLikes,
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

