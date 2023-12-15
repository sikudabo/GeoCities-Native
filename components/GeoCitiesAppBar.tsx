import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Appbar } from "react-native-paper";
import GeoCitiesLogo from './GeoCitiesLogo';
import { colors } from './colors';

type GeoCitiesAppBarProps = {
    navigationRef: any;
};

export default function GeoCitiesAppBar({
    navigationRef,
}: GeoCitiesAppBarProps) {
    const [routeIndex, setRouteIndex] = useState(typeof navigationRef.current !== 'undefined' && typeof navigationRef.current.getRootState().index !== 'undefined' ? navigationRef.current.getRootState().index : 0);
    const styles = StyleSheet.create({
        appBarStyle: {
            backgroundColor: colors.geoCitiesGreen,
        },
    });

    useEffect(() => {
        if (typeof navigationRef.current.getRootState() !== 'undefined' && typeof navigationRef.current.getState() !== 'undefined') {
            console.log(navigationRef.current.getRootState().index);
            console.log('Route is:', navigationRef.current.getState().routes[navigationRef.current.getRootState().index]);
        }
    }, [navigationRef.current]);

    function dummy() {
        console.log(navigationRef.current.getRootState().index)
        console.log(navigationRef.current.getState());
        navigationRef.current.navigate('Feed');
    }

    return (
        <Appbar.Header style={styles.appBarStyle} elevated>
            <Appbar.Action icon="menu" onPress={dummy} />
            <Appbar.Content title={<GeoCitiesLogo height={40} width={40} color={colors.white} />} />
        </Appbar.Header>
    );
}