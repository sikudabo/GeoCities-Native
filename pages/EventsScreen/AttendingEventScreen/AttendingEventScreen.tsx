import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { UserType } from '../../../typings';
import { GeoCitiesBackArrowIcon, GeoCitiesBodyText, LoadingIndicator, UserCard, colors } from '../../../components';
import { useFetchEventAttendees } from '../../../hooks/fetch-hooks';

type AttendingEventScreenProps = {
    navigation: any;
    route: any;
};

type DataLayerProps = Pick<AttendingEventScreenProps, 'navigation'> & {
    eventId: string;
};

/**
 * Type for the display layer. This includes is loading in order to show the loading indicator and the list of users/attendees to map through.
 */
type AttendingEventScreenDisplayLayerProps = {
    handleBackPress: () => void;
    isLoading: boolean;
    users: Array<UserType>;
};

export default function AttendingEventScreen({
    navigation,
    route,
}: AttendingEventScreenProps) {
    const { eventId } = route.params;
    return <AttendingEventScreen_DisplayLayer {...useDataLayer({  eventId, navigation })} />;
}

function AttendingEventScreen_DisplayLayer({
    handleBackPress,
    isLoading,
    users,
}: AttendingEventScreenDisplayLayerProps) {
    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <ScrollView>
                    <View style={styles.header}>
                        <View style={styles.backButtonContainer}>
                            <TouchableOpacity onPress={handleBackPress}>
                                <GeoCitiesBackArrowIcon color={colors.white} height={25} width={25} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.headerTitleContainer}>
                            <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text={`${typeof users === 'undefined' || users.length === 0 ? 'No Attendees' : 'Attendees'}`} />
                        </View>
                    </View>
                    {typeof users !== 'undefined' && users.length > 0 && (
                        <View style={styles.usersSection}>
                            {users.map((user, index) => (
                                <View 
                                    key={index}
                                    style={styles.usersCardContainer}
                                >
                                    <UserCard user={user} />
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
function useDataLayer({ eventId, navigation }: DataLayerProps) {
    const { data: users, isLoading } = useFetchEventAttendees(eventId);

    function handleBackPress() {
        navigation.navigate('EventsScreen');
        return;
    }

    return {
        handleBackPress,
        isLoading,
        users: isLoading || typeof users === 'undefined' ? [] : users,
    };
}

const styles = StyleSheet.create({
    backButtonContainer: {
        flex: 1,
    },
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        paddingTop: 20,
    },
    header: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 50,
        paddingLeft: 10,
        paddingRight: 10,
    },
    headerTitleContainer: {
        flex: 2,
    },
    usersCardContainer: {
        paddingBottom: 20,
    },
    usersSection: {
        paddingTop: 20,
    },
});