import { StyleSheet, View } from 'react-native';
import millify from 'millify';
import { GroupType } from '../../../typings';
import { GeoCitiesBodyText, colors } from '../../../components';

type AboutTabProps = {
    group: GroupType;
};

type AboutTabDisplayLayerProps = {
    membersCountText: string;
    topicMessage: string;
};

export default function AboutTab({ group }: AboutTabProps) {
    return <AboutTab_DisplayLayer {...useDataLayer(group)} />;
}


function AboutTab_DisplayLayer({
    membersCountText,
    topicMessage,
}: AboutTabDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.topSectionContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={700} text="About" />
            </View>
            <View style={styles.topicContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={14} fontWeight={500} text={topicMessage} />
            </View>
            <View style={styles.topicContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={14} fontWeight={500} text={membersCountText} />
            </View>
        </View>
    );
}

function useDataLayer(group: GroupType) {
    const { members, topic } = group;
    const memberCount = typeof members !== 'undefined' ? members.length : 0;
    const membersCountText = `${memberCount !== 1 ? millify(memberCount) + ' Members' : memberCount + ' Member'}`;
    const topicMessage = `Topic: ${topic.charAt(0).toUpperCase() + topic.slice(1)}`;
    return {
        membersCountText,
        topicMessage,
    };
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 30,
    },
    topicContainer: {
        alignItems: 'center',
        paddingTop: 30,
    },
    topSectionContainer: {
        alignItems: 'center',
    },
});