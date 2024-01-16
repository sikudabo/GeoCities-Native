import { useEffect } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import truncate from 'lodash/truncate';
import { useNavigation } from '@react-navigation/native';
import { GeoCitiesAvatar, GeoCitiesBodyText, colors } from '../../components';
import { useUser } from '../../hooks/storage-hooks';
import { useFetchUserData } from '../../hooks/fetch-hooks';
import { UserType } from '../../typings';

type ProfileProps = {
    navigation: any;
}

type ProfileDisplayLayerProps = {
    avatar: string;
    followerCount: number;
    followingCount: number;
    fullName: string;
    handleNavigation: () => void;
    user: UserType;
};

type NavigationProps = {
    navigation: {
        navigate: (name: string, params?: any) => void;
    };
};

export default function Profile({ navigation }: ProfileProps) {
    return <Profile_DisplayLayer {...useDataLayer({ navigation })} />;
}

function Profile_DisplayLayer({
    avatar,
    followerCount,
    followingCount,
    fullName,
    handleNavigation,
    user,
}: ProfileDisplayLayerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <GeoCitiesAvatar src={`${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${avatar}`} size={120} />
            </View>
            <View style={styles.nameContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={24} fontWeight={900} text={truncate(fullName, { length: 40 })} />
            </View>
            <View style={styles.profileStatsSection}>
                <View style={styles.followerStatSection}>
                    <GeoCitiesBodyText color={colors.white} text={followerCount.toString()} textAlign='center'/>
                    <GeoCitiesBodyText color={colors.white} text={followerCount === 1 ? 'Follower' : 'Followers' } />
                </View>
                <View style={styles.followerStatSection}>
                    <GeoCitiesBodyText color={colors.white} text={followingCount.toString()} textAlign='center'/>
                    <GeoCitiesBodyText color={colors.white} text={'Following'} />
                </View>
            </View>
        </View>
    );
}

function useDataLayer({ navigation }: ProfileProps) {
    const { user, setUser } = useUser();
    const { _id } = user;
    const { data, isLoading } = useFetchUserData({ _id });
    const { user: currentUser } = typeof data !== 'undefined' && !isLoading ? data : { user: undefined };
    const { avatar, firstName, followers, following, lastName } = user;
    const followerCount = followers.length;
    const followingCount = following.length;

    useEffect(() => {
        if (!currentUser) {
            return;
        }
        let updatedUser = currentUser;
        updatedUser.isLoggedIn = true;
        setUser(updatedUser);
    }, [currentUser]);


    function handleNavigation() {
        navigation.navigate('Feed');
    }

    return {
        avatar,
        followerCount,
        followingCount,
        fullName: `${firstName} ${lastName}`,
        handleNavigation,
        user,
    };
}

const styles = StyleSheet.create({
    avatarContainer: {
        paddingTop: 20,
    },
    container: {
        alignItems: 'center',
        backgroundColor: colors.nightGray,
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        paddingTop: 10,
    },
    followerStatSection: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: 2,
    },
    nameContainer: {
        paddingTop: 10,
    },
    profileStatsSection: {
        columnGap: 25,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 10,
        paddingTop: 30,
        width: '100%',
    },
});

