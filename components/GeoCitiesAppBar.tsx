import { StyleSheet } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { Appbar } from "react-native-paper";
import GeoCitiesLogo from './GeoCitiesLogo';
import { colors } from './colors';
import { useUser } from '../hooks/storage-hooks';

type GeoCitiesAppBarProps = {
    navigationRef: any;
    openDrawer: () => void;
};

export default function GeoCitiesAppBar({
    navigationRef,
    openDrawer,
}: GeoCitiesAppBarProps) {
    const [routeIndex, setRouteIndex] = useState(typeof navigationRef.current !== 'undefined' && typeof navigationRef.current.getRootState().index !== 'undefined' ? navigationRef.current.getRootState().index : 0);
    const { user } = useUser();
    const { isLoggedIn } = user;
    const styles = StyleSheet.create({
        appBarStyle: {
            backgroundColor: colors.nightGray,
        },
    });

    const isUserLoggedIn = useMemo(() => {
        if (typeof user === 'undefined' || !user.isLoggedIn) {
            return false;
        } else {
            return true;
        }
    }, [user])

    useEffect(() => {
        if (typeof navigationRef.current.getRootState() !== 'undefined' && typeof navigationRef.current.getState() !== 'undefined') {
            // console.log(navigationRef.current.getRootState().index);
            // console.log('Route is:', navigationRef.current.getState().routes[navigationRef.current.getRootState().index]);
        }
    }, [navigationRef.current]);

    return (
        isUserLoggedIn ? (
            <Appbar.Header style={styles.appBarStyle} elevated>
                <Appbar.Action icon="menu" onPress={openDrawer} />
                <Appbar.Content title={<GeoCitiesLogo height={40} width={40} color={colors.white} />} />
            </Appbar.Header>
        ) : <></>
    );
}