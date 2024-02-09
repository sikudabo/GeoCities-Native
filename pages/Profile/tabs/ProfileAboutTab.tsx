import { View, StyleSheet } from 'react-native';
import { UserType } from '../../../typings';
import { birthdayToYears } from '../../../utils/helpers';
import { GeoCitiesBodyText, colors } from '../../../components';

type ProfileAboutTabProps = {
    user: UserType,
};

type ProfileAboutTabDisplayLayerProps = {
    age: number;
}

export default function ProfileAboutTabs({ user }: ProfileAboutTabProps) {
    return <ProfileAboutTabs_DisplayLayer {...useDataLayer({ user })} />;
}


function ProfileAboutTabs_DisplayLayer({
    age
}: ProfileAboutTabDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.ageContainer}>
                <GeoCitiesBodyText color={colors.white} text={`${age.toString()} years old`} />
            </View>
        </View>
    );
}

function useDataLayer({ user }: ProfileAboutTabProps) {
    const { createdOn, dob } = typeof user !== 'undefined' ? user : { createdOn: new Date(), dob: new Date() };
    console.log('The user is:', user);
    const age = birthdayToYears(dob);
    const createdDate = new Date(createdOn).getMonth();
    console.log(createdDate);
    return {
       age,
    }
};

const styles = StyleSheet.create({
    ageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    container: {
        paddingTop: 40,
    },
});