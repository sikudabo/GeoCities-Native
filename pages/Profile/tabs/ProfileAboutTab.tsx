import { View, StyleSheet, TouchableOpacity, } from 'react-native';
import truncate from 'lodash/truncate';
import * as Linking from 'expo-linking';
import { UserType } from '../../../typings';
import { birthdayToYears, createdDate } from '../../../utils/helpers';
import { GeoCitiesBodyText, GeoCitiesMailIconOutlined, colors } from '../../../components';

type ProfileAboutTabProps = {
    user: UserType,
};

type ProfileAboutTabDisplayLayerProps = {
    age: number;
    createdOnString: string;
    email: string;
    handleEmailPress: () => void;
}

export default function ProfileAboutTabs({ user }: ProfileAboutTabProps) {
    return <ProfileAboutTabs_DisplayLayer {...useDataLayer({ user })} />;
}


function ProfileAboutTabs_DisplayLayer({
    age,
    createdOnString,
    email,
    handleEmailPress,
}: ProfileAboutTabDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.ageContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={14} text={`${age.toString()} years old`} />
            </View>
            <View style={styles.createdOnContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={14} text={`Account made ${createdOnString}`} />
            </View>
            <TouchableOpacity onPress={handleEmailPress} style={styles.emailContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={14} text={email} />
            </TouchableOpacity>
            <View style={styles.communitiesHeaderContainer}>
            <GeoCitiesBodyText color={colors.white} fontSize={14} text='Communities' />
            </View>
        </View>
    );
}

function useDataLayer({ user }: ProfileAboutTabProps) {
    const { createdOn, dob, email } = typeof user !== 'undefined' ? user : { createdOn: new Date(), dob: new Date(), email: ''};
    const age = birthdayToYears(dob);
    const createdOnString = createdDate(createdOn as Date);

    function handleEmailPress() {
        Linking.openURL(`mailto:${email}`);
    }

    return {
       age,
       createdOnString,
       email: truncate(email, { length: 40 }),
       handleEmailPress,
    }
};

const styles = StyleSheet.create({
    ageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    communitiesHeaderContainer: {
        alignItems: 'center',
        borderBottomColor: colors.white,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        justifyContent: 'center',
        paddingBottom: 20,
        paddingTop: 20,
        width: '100%',
    },
    container: {
        paddingTop: 40,
    },
    createdOnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        width: '100%',
    },
    emailContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20, 
        width: '100%',
    },
});