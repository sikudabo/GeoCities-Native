import { StyleSheet, View } from 'react-native';
import millify from 'millify';
import { convertToDate } from '../../../utils/helpers';
import { GroupType } from '../../../typings';
import { GeoCitiesBodyText, colors } from '../../../components';

type AboutTabProps = {
    group: GroupType;
};

type AboutTabDisplayLayerProps = {
    dateCreated: string;
    membersCountText: string;
    rules?: Array<string>;
    topicMessage: string;
};

export default function AboutTab({ group }: AboutTabProps) {
    return <AboutTab_DisplayLayer {...useDataLayer(group)} />;
}


function AboutTab_DisplayLayer({
    dateCreated,
    membersCountText,
    rules,
    topicMessage,
}: AboutTabDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.topSectionContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={700} text="About" />
            </View>
            <View style={styles.topicContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={16} fontWeight={500} text={topicMessage} />
            </View>
            <View style={styles.topicContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={16} fontWeight={500} text={membersCountText} />
            </View>
            <View style={styles.topicContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={16} fontWeight={500} text={dateCreated} />
            </View>
            {typeof rules !== 'undefined' && rules.length !== 0 && (
                <View style={styles.rulesSection}>
                    <View style={styles.rulesHeader}>
                        <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={700} text="Rules" />
                    </View>
                    {rules.map((rule, index) => (
                        <View key={index} style={styles.ruleContainer}>
                            <GeoCitiesBodyText color={colors.white} fontSize={16} fontWeight={700} text={`${index + 1}. ${rule}`} />
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

function useDataLayer(group: GroupType) {
    const { createdAt, members, rules, topic } = group;
    const dateCreated = `Created On ${convertToDate(createdAt)}`;
    const memberCount = typeof members !== 'undefined' ? members.length : 0;
    const membersCountText = `${memberCount !== 1 ? millify(memberCount) + ' Members' : memberCount + ' Member'}`;
    const topicMessage = `Topic: ${topic.charAt(0).toUpperCase() + topic.slice(1)}`;
    return {
        dateCreated,
        membersCountText,
        rules,
        topicMessage,
    };
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 30,
    },
    ruleContainer: {
        paddingTop: 20,
    },
    rulesHeader: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    rulesSection: {
        paddingTop: 10,
        width: '100%',
    },
    topicContainer: {
        alignItems: 'center',
        paddingTop: 30,
    },
    topSectionContainer: {
        alignItems: 'center',
    },
});