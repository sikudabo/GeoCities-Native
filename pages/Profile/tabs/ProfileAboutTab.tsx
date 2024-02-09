import { View, StyleSheet } from 'react-native';
import { UserType } from '../../../typings';
import { birthdayToYears } from '../../../utils/helpers';
import { GeoCitiesBodyText, colors } from '../../../components';
import { months } from '../../../utils/constants';

type ProfileAboutTabProps = {
    user: UserType,
};

type ProfileAboutTabDisplayLayerProps = {
    age: number;
    createdOnString: string;
}

export default function ProfileAboutTabs({ user }: ProfileAboutTabProps) {
    return <ProfileAboutTabs_DisplayLayer {...useDataLayer({ user })} />;
}


function ProfileAboutTabs_DisplayLayer({
    age,
    createdOnString,
}: ProfileAboutTabDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.ageContainer}>
                <GeoCitiesBodyText color={colors.white} text={`${age.toString()} years old`} />
            </View>
            <View style={styles.createdOnContainer}>
                <GeoCitiesBodyText color={colors.white} text={`Account made ${createdOnString}`} />
            </View>
        </View>
    );
}

function useDataLayer({ user }: ProfileAboutTabProps) {
    const { createdOn, dob } = typeof user !== 'undefined' ? user : { createdOn: new Date(), dob: new Date() };
    const age = birthdayToYears(dob);
    const createdDate = new Date(createdOn);
    const createdDay = createdDate.getDate();
    const createdMonth = createdDate.getMonth();
    const createdYear = createdDate.getFullYear();
    const createdMonthString = months[createdMonth];
    const createdOnString = `${createdMonthString} ${createdDay}, ${createdYear}`;
    return {
       age,
       createdOnString,
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
    createdOnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        width: '100%',
    }
});