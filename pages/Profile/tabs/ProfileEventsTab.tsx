import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { EventType } from "../../../typings";
import { useFetchUserEvents } from "../../../hooks/fetch-hooks";
import { EventCard, GeoCitiesBodyText, LoadingIndicator, colors  } from "../../../components";

type ProfileEventsTabProps = {
    userId: string;
};

type ProfileEventsTabDisplayLayerProps = {
    events: Array<EventType>;
    isLoading: boolean;
};

export default function ProfileEventsTab({ userId }: ProfileEventsTabProps) {
    return <ProfileEventsTab_DisplayLayer {...useDataLayer(userId)} />;
}

function ProfileEventsTab_DisplayLayer({
    events,
    isLoading,
}: ProfileEventsTabDisplayLayerProps) {
    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <ScrollView>
                    {typeof events === 'undefined' || events.length === 0 ? (
                        <View style={styles.noEventsMessageContainer}>
                            <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="No Events" />
                        </View>
                    ): (
                        <View>
                            {events.map((event, index) => (
                                <View
                                    key={index}
                                    style={styles.eventCardContainer}
                                >
                                    <EventCard 
                                        event={event}
                                    />
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}


function useDataLayer(_id: string) {
    const { data: events, isLoading } = useFetchUserEvents(_id);

    return {
        events,
        isLoading,
    };
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
    },
    eventCardContainer: {
        paddingBottom: 20,
    },
    noEventsMessageContainer: {
        alignItems: 'center',
    },
});