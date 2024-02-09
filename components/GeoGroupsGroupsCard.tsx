import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { GroupType } from '../typings';
import GeoCitiesAvatar from './GeoCitiesAvatar';
import GeoCitiesBodyText from './GeoCitiesBodyText';
import GeoCitiesButton from './GeoCitiesButton';
import { colors } from './colors';

type GeoGroupsGroupsCardProps = {
    group: GroupType;
};

type GeoGroupsGroupCardDisplayLayerProps = {
    avatarUri: string;
    description: string;
    groupName: string;
    handleViewButtonPress: () => void;
    membersCount: number;
    topic: string;
};

export default function GeoGroupsGroupsCard({ group }: GeoGroupsGroupsCardProps) {
    return <GeoGroupsGroupsCard_DisplayLayer {...useDataLayer({ group})} />;
}

function GeoGroupsGroupsCard_DisplayLayer({
    avatarUri,
    description,
    groupName,
    handleViewButtonPress,
    membersCount,
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
            <View style={styles.membersCountSection}>
                <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight='normal' text={`${membersCount} ${membersCount === 1 ? 'member' : 'members'}`} />
            </View>
            <View style={styles.groupDescriptionContainer}>
                <SafeAreaView>
                    <ScrollView>
                        <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight={900} text={description} />
                    </ScrollView>
                </SafeAreaView>
            </View>
            <View style={styles.viewButtonContainer}>
                <TouchableOpacity onPress={handleViewButtonPress}>
                    <GeoCitiesButton buttonColor={colors.salmonPink} text="View" />
                </TouchableOpacity>
            </View>
        </Surface>
    );
}

function useDataLayer({ group }: GeoGroupsGroupsCardProps) {
    const { avatar, groupName, description, members, topic } = group;
    const avatarUri = `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${avatar}`;
    const navigation: any = useNavigation();
    const membersCount = members.length;

    function handleViewButtonPress() {
        navigation.navigate('GroupScreen', { group });
    }

    return {
        avatarUri,
        groupName,
        description,
        handleViewButtonPress,
        membersCount,
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
    groupDescriptionContainer: {
        paddingTop: 30,
        width: '100%',
    },
    groupNameContainer: {
        alignItems: 'center',
        paddingTop: 20,
    },
    membersCountSection: {
        alignItems: 'center',
        paddingTop: 20,
    },
    topicSection: {
        alignItems: 'center',
        paddingTop: 20,
    },
    viewButtonContainer: {
        paddingBottom: 10,
        paddingTop: 20,
    },
});