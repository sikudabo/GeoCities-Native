import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useFetchAllEvents } from "../../hooks/fetch-hooks";
import { EventType } from "../../typings";
import { GeoCitiesBodyText, GeoCitiesButton, LoadingIndicator, colors } from "../../components";

type EventsScreenDisplayLayerProps = {
    events: Array<EventType>;
    isLoading: boolean;
    setShowAllEvents: React.Dispatch<React.SetStateAction<boolean>>;
    showAllEvents: boolean;
};

export default function EventsScreen() {
    return <EventsScreen_DisplayLayer { ...useDataLayer()} />;
}

function EventsScreen_DisplayLayer({
    events,
    isLoading,
    setShowAllEvents,
    showAllEvents,
}: EventsScreenDisplayLayerProps) {
    if (isLoading) {
        return <LoadingIndicator />;
    }

    /* if (typeof events !== 'undefined' && events.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.topHeaderContainer}>
                    <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="No Events" />
                </View>
            </View>
        )
    } */

    return (
        <View style={styles.container}>
            <View style={styles.topHeaderContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="Events" />
            </View>
            <View style={styles.headerActionButtonContainer}>
                <GeoCitiesButton buttonColor={colors.salmonPink} icon="pencil" text="Create Event" />
            </View>
            <View style={styles.headerActionButtonContainer}>
                <GeoCitiesButton buttonColor={showAllEvents ? colors.hornetsTeal : colors.coolBlue} onPress={() => setShowAllEvents(!showAllEvents)} text={showAllEvents ? "Show Nearby" : "Show All"} />
            </View>
        </View>
    );
}

function useDataLayer() {
    const { data: events, isLoading } = useFetchAllEvents();
    const [showAllEvents, setShowAllEvents] = useState(true);

    return {
        events: isLoading || typeof events === 'undefined' ? [] : events,
        isLoading,
        setShowAllEvents,
        showAllEvents,
    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        paddingTop: 20,
    },
    headerActionButtonContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 30,
        width: '100%',
    },
    topHeaderContainer: {
        alignItems: 'center',
    },
});