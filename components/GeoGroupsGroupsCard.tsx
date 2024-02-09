import { StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import { GroupType } from '../typings';
import GeoCitiesBodyText from './GeoCitiesBodyText';
import { colors } from './colors';

type GeoGroupsGroupsCardProps = {
    group: GroupType;
};

type GeoGroupsGroupCardDisplayLayerProps = {
    groupName: string;
};

export default function GeoGroupsGroupsCard({ group }: GeoGroupsGroupsCardProps) {
    return <GeoGroupsGroupsCard_DisplayLayer {...useDataLayer({ group})} />;
}

function GeoGroupsGroupsCard_DisplayLayer({
    groupName,
}: GeoGroupsGroupCardDisplayLayerProps) {
    return (
        <Surface elevation={4} style={styles.cardContainer}>
            <GeoCitiesBodyText color={colors.white} text={groupName} />
        </Surface>
    );
}

function useDataLayer({ group }: GeoGroupsGroupsCardProps) {
    const { groupName } = group;
    return {
        groupName,
    };
};

const styles = StyleSheet.create({
    cardContainer: {
        paddingLeft: 10,
        paddingRight: 10,
    },
});