import { StyleSheet, View } from 'react-native';
import truncate from 'lodash/truncate';
import { Surface } from 'react-native-paper';
import GeoCitiesAvatar from '../GeoCitiesAvatar';
import GeoCitiesBodyText from '../GeoCitiesBodyText';
import GeoCitiesButton from '../GeoCitiesButton';
import { colors } from '../colors';
import { UserType } from '../../typings';
import { birthdayToYears } from '../../utils/helpers';

type UserCardProps = {
    user: UserType;
};

type UserCardDisplayLayerProps = {
    avatarPath: string;
    cityStatePath: string;
    fullName: string;
    userAge: number;
}

export default function UserCard({ user }: UserCardProps) {
    return <UserCard_DisplayLayer {...useDataLayer(user)} />;
}

function UserCard_DisplayLayer({
    avatarPath,
    cityStatePath,
    fullName,
    userAge,
}: UserCardDisplayLayerProps) {
    return (
        <Surface elevation={4} style={styles.cardContainer}>
            <View style={styles.avatarSection}>
                <GeoCitiesAvatar size={50} src={avatarPath} />
            </View>
            <View style={styles.nameContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={16} fontWeight={500} text={fullName} />
            </View>
            <View style={styles.nameContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={16} fontWeight={500} text={userAge.toString()} />
            </View>
            <View style={styles.nameContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={16} fontWeight={500} text={cityStatePath} />
            </View>
            <View style={styles.viewButtonContainer}>
                <GeoCitiesButton buttonColor={colors.salmonPink} text="View Profile" />
            </View>
        </Surface>
    );
}

function useDataLayer(user: UserType) {
    const { avatar, dob, firstName, lastName, locationCity, locationState } = user;
    const avatarPath = `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${avatar}`;
    const cityStatePath = `${locationCity}, ${locationState}`;
    const fullName = firstName + ' ' + lastName;
    const userAge = birthdayToYears(dob);

    return {
        avatarPath,
        cityStatePath,
        fullName: truncate(fullName, { length: 50 }),
        userAge,
    };
}

const styles = StyleSheet.create({
    avatarSection: {
        alignItems: 'center',
        paddingTop: 20,
        width: '100%',
    },
    cardContainer: {
        borderRadius: 5,
        width: '100%',
    },
    nameContainer: {
        alignItems: 'center',
        paddingTop: 20,
    },
    viewButtonContainer: {
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        width: '100%',
    },
});