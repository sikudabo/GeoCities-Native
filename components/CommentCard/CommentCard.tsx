import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';
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
    createdAt: number;
    userName: string;
}

export default function CommentCard({ comment }: CommentCardProps) {
    return <CommentCard_DisplayLayer {...useDataLayer({ comment })} />;
}

function CommentCard_DisplayLayer({
    avatarUri,
    createdAt,
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
        </Surface>
    );
}

function useDataLayer({ comment }: DataLayerProps) {
    const { authorId, createdAt, userName } = comment;
    const avatarUri = `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo-by-user-id/${authorId}`;
    return {
      avatarUri,
      createdAt,
      userName,
    };
}

const styles = StyleSheet.create({
    cardContainer: {
        borderTopColor: colors.white,
        borderStyle: 'solid',
        borderWidth: 1,
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