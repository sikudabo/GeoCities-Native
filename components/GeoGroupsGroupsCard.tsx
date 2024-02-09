import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';
import { GroupType } from '../typings';
import GeoCitiesAvatar from './GeoCitiesAvatar';
import GeoCitiesBodyText from './GeoCitiesBodyText';
import { colors } from './colors';

type GeoGroupsGroupsCardProps = {
    group: GroupType;
};

type GeoGroupsGroupCardDisplayLayerProps = {
    avatarUri: string;
    groupName: string;
    topic: string;
};

export default function GeoGroupsGroupsCard({ group }: GeoGroupsGroupsCardProps) {
    return <GeoGroupsGroupsCard_DisplayLayer {...useDataLayer({ group})} />;
}

function GeoGroupsGroupsCard_DisplayLayer({
    avatarUri,
    groupName,
    topic,
}: GeoGroupsGroupCardDisplayLayerProps) {
    return (
        <Surface elevation={4} style={styles.cardContainer}>
            <View style={styles.avatarContainer}>
                <GeoCitiesAvatar size={75} src={avatarUri} />
            </View>
            <View style={styles.groupNameContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={16} fontWeight={400} text={groupName} />
            </View>
            <View style={styles.topicSection}>
                <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight='normal' text={`Topic: ${topic}`} />
            </View>
        </Surface>
    );
}

function useDataLayer({ group }: GeoGroupsGroupsCardProps) {
    const { avatar, groupName, topic } = group;
    const avatarUri = `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${avatar}`;
    return {
        avatarUri,
        groupName,
        topic: topic.charAt(0).toUpperCase() + topic.slice(1),
    };
};

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    cardContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        width: '100%',
    },
    groupNameContainer: {
        alignItems: 'center',
        paddingTop: 20,
    },
    topicSection: {
        alignItems: 'center',
        paddingTop: 20,
    },
});