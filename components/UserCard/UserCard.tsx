import { StyleSheet, View } from 'react-native';
import truncate from 'lodash/truncate';
import { Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import GeoCitiesAvatar from '../GeoCitiesAvatar';
import GeoCitiesBodyText from '../GeoCitiesBodyText';
import GeoCitiesButton from '../GeoCitiesButton';
import { colors } from '../colors';
import { UserType } from '../../typings';
import { birthdayToYears } from '../../utils/helpers';
import { useUser } from '../../hooks/storage-hooks';

type UserCardProps = {
    user: UserType;
};

type UserCardDisplayLayerProps = {
    avatarPath: string;
    cityStatePath: string;
    fullName: string;
    handleViewProfilePress: () => void;
    userAge: number;
}

export default function UserCard({ user }: UserCardProps) {
    return <UserCard_DisplayLayer {...useDataLayer(user)} />;
}

function UserCard_DisplayLayer({
    avatarPath,
    cityStatePath,
    fullName,
    handleViewProfilePress,
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
                <GeoCitiesButton buttonColor={colors.salmonPink} onPress={handleViewProfilePress} text="View Profile" />
            </View>
        </Surface>
    );
}

function useDataLayer(user: UserType) {
    const { avatar, dob, firstName, _id, lastName, locationCity, locationState } = user;
    const { user: currentUser } = useUser();
    const { _id: currentUserId } = currentUser;
    const avatarPath = `${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${avatar}`;
    const cityStatePath = `${locationCity}, ${locationState}`;
    const fullName = firstName + ' ' + lastName;
    const userAge = birthdayToYears(dob);
    const navigation: any = useNavigation();

    function handleViewProfilePress() {
      navigation.navigate('Profile', { isVisitor: _id !== currentUserId, userId: _id !== currentUserId ? _id : undefined });
      return;  
    }

    return {
        avatarPath,
        cityStatePath,
        fullName: truncate(fullName, { length: 50 }),
        handleViewProfilePress,
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