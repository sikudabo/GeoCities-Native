import { StyleSheet, View } from 'react-native';
import { GroupType } from '../../../typings';
import { GeoCitiesBodyText, colors } from '../../../components';

type AboutTabProps = {
    group: GroupType;
};

export default function AboutTab({ group }: AboutTabProps) {
    return <AboutTab_DisplayLayer {...useDataLayer(group)} />;
}


function AboutTab_DisplayLayer() {
    return (
        <View style={styles.container}>
            <View style={styles.topSectionContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={700} text="About" />
            </View>
        </View>
    );
}

function useDataLayer(group: GroupType) {
    return {
    }
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 30,
    },
    topSectionContainer: {
        alignItems: 'center',
    },
});