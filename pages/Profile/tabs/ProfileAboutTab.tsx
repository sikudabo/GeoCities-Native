import { View, StyleSheet, TouchableOpacity, } from 'react-native';
import truncate from 'lodash/truncate';
import * as Linking from 'expo-linking';
import { GroupType, UserType } from '../../../typings';
import { birthdayToYears, createdDate } from '../../../utils/helpers';
import { GeoCitiesBodyText, GeoCitiesMailIconOutlined, GeoGroupsGroupsCard, colors } from '../../../components';

type ProfileAboutTabProps = {
    user: UserType,
    userGroups: Array<GroupType>;
};

type ProfileAboutTabDisplayLayerProps = {
    age: number;
    createdOnString: string;
    email: string;
    handleEmailPress: () => void;
    userGroups: Array<GroupType>;
};

export default function ProfileAboutTabs({ user, userGroups }: ProfileAboutTabProps) {
    return <ProfileAboutTabs_DisplayLayer {...useDataLayer({ user, userGroups })} />;
}


function ProfileAboutTabs_DisplayLayer({
    age,
    createdOnString,
    email,
    handleEmailPress,
    userGroups,
}: ProfileAboutTabDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.ageContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={14} text={`${age.toString()} years old`} />
            </View>
            <View style={styles.createdOnContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={14} text={`Joined ${createdOnString}`} />
            </View>
            <TouchableOpacity onPress={handleEmailPress} style={styles.emailContainer}>
                <GeoCitiesMailIconOutlined color={colors.white} height={20} width={20} />
                <GeoCitiesBodyText color={colors.white} fontSize={14} text={email} />
            </TouchableOpacity>
            {userGroups.length > 0 && (
                <View>
                    <View style={styles.communitiesHeaderContainer}>
                        <GeoCitiesBodyText color={colors.white} fontSize={14} text='Groups' />
                    </View>
                    <View>
                        {userGroups.map((group, index) => (
                            <View style={styles.groupContainer}>
                                <GeoGroupsGroupsCard 
                                    group={group}
                                    key={index}
                                />
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
}

function useDataLayer({ user, userGroups }: ProfileAboutTabProps) {
    const { createdOn, dob, email } = typeof user !== 'undefined' ? user : { createdOn: new Date(), dob: new Date(), email: '' };
    const myGroups = typeof userGroups !== 'undefined' ? userGroups : [];
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
       userGroups: myGroups,
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
        columnGap: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 20, 
        width: '100%',
    },
    groupContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
    },
});