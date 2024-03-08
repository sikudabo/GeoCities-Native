import { Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Surface } from 'react-native-paper';
import { EventType } from '../../typings';
import { convertToDate } from '../../utils/helpers';
import { useUser } from '../../hooks/storage-hooks';
import { GeoCitiesAvatar, GeoCitiesBodyText, GeoCitiesButton, GeoCitiesDeleteIcon, LoadingIndicator, colors } from '../../components';


type EventCardDisplayLayerProps = {
    attendeeCount: number;
    description: string;
    eventAddress: string;
    eventDate: string;
    handleNavigate: () => void;
    imgSrc: string;
    location: string;
    src: string;
    title: string;
    userName: string;
};

export default function EventCard({ event }: { event: EventType }) {
    return <EventCard_DisplayLayer {...useDataLayer({ event })} />;
}

function EventCard_DisplayLayer({
    attendeeCount,
    description,
    eventAddress,
    eventDate,
    handleNavigate,
    imgSrc,
    location,
    src,
    title,
    userName,
}: EventCardDisplayLayerProps) {
    return (
        <Surface style={styles.container}>
            <View style={styles.headerContainer}>
                <GeoCitiesAvatar size={25} src={src} />
                <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight={900} text={userName} />
                <View style={styles.dateContainer}>
                    <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight={900} text={eventDate} />
                </View>
            </View>
            <View style={styles.titleContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={16} fontWeight={500} text={title} />
            </View>
            <View style={styles.locationSection}>
                <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight={'normal'} text={location} />
            </View>
            <View style={styles.addressSectionContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight={'normal'} text={eventAddress} />
            </View>
            <View style={styles.imageContainer}>
                <Image source={{ uri: imgSrc }} style={styles.image} />
            </View>
            <View style={styles.descriptionSectionContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight={'normal'} text={description} />
            </View>
            <View style={styles.actionsSectionContainer}>
                <TouchableOpacity>
                    <GeoCitiesBodyText color={colors.white} fontSize={12} fontWeight='normal' text={`${attendeeCount} ${attendeeCount === 1 ? 'attendee' : 'attendees' }`} />
                </TouchableOpacity>
            </View>
        </Surface>       
    );
}



function useDataLayer({ event }: { event: EventType }) {
    const navigation: any = useNavigation();
    const { attendees, authorId, avatar, description, eventAddress, eventCity, eventDate, eventState, title, userName } = event;
    const { user } = useUser();
    const { _id } = user;
    const src = `${process.env.EXPO_PUBLIC_API_BASE_URI}get-avatar-by-user-id/${authorId}`;
    const imgSrc = `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${avatar}`;
    const location = `${eventCity}, ${eventState}`;

    function handleNavigate() {
        if (_id === authorId) {
            navigation.navigate('Profile');
            return;
        }

        navigation.navigate('Profile', { isVisitor: true, userId: authorId });
        return;
    }

    return {
        attendeeCount: attendees.length,
        description,
        eventAddress,
        eventDate: convertToDate(eventDate),
        handleNavigate,
        imgSrc,
        location,
        src,
        title,
        userName,
    };
}

const styles = StyleSheet.create({
    actionsSectionContainer: {
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: 20,
        paddingTop: 20,
    },
    addressSectionContainer: {
        alignItems: 'center',
        paddingTop: 10,
    },
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        width: '100%',
    },
    descriptionSectionContainer: {
        paddingTop: 20,
    },
    dateContainer: {
        marginLeft: 'auto',
    },
    headerContainer: {
        display: 'flex',
        columnGap: 10,
        flexDirection: 'row',
    },
    image: {
        height: '100%',
        width: '100%',
    },
    imageContainer: {
        height: 350,
        paddingTop: 20,
    },
    locationSection: {
        alignItems: 'center',
        paddingTop: 10,
    },
    titleContainer: {
        alignItems: 'center',
        paddingTop: 20,
        width: '100%',
    },
});
