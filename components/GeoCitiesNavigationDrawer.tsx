import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Drawer } from 'react-native-paper';
import { DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import GeoCitiesBodyText from './GeoCitiesBodyText';
import { colors } from './colors';

export default function GeoCitiesNavigationDrawer() {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.geoCitiesBlue,
            paddingLeft: 10,
        },
        drawerContent: {
            flex: 1,
        },
        drawerHeaderSection: {
            
        },
    });

    return (
        <DrawerContentScrollView style={styles.container}>
            <View style={styles.drawerContent}>
                <View>
                    <GeoCitiesBodyText color={colors.white} fontWeight="900" text="GeoCities" />
                </View>
            </View>
        </DrawerContentScrollView>
    );
}