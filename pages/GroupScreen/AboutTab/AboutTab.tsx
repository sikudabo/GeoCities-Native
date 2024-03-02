import { StyleSheet, View } from 'react-native';
import { GroupType } from '../../../typings';
import { GeoCitiesBodyText, colors } from '../../../components';

type AboutTabProps = {
    group: GroupType;
};

type AboutTabDisplayLayerProps = {
    topicMessage: string;
};

export default function AboutTab({ group }: AboutTabProps) {
    return <AboutTab_DisplayLayer {...useDataLayer(group)} />;
}


function AboutTab_DisplayLayer({
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
        </View>
    );
}

function useDataLayer(group: GroupType) {
    const { topic } = group;
    const topicMessage = `Topic: ${topic.charAt(0).toUpperCase() + topic.slice(1)}`;
    return {
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