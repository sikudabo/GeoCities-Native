import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Drawer, Title } from 'react-native-paper';
import { DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import GeoCitiesAvatar from './GeoCitiesAvatar';
import GeoCitiesBodyText from './GeoCitiesBodyText';
import { colors } from './colors';
import { useUser } from '../hooks/storage-hooks';
const SimeonAvatar = require('../assets/static-images/simeon_profile.jpeg');

export default function GeoCitiesNavigationDrawer({ navigation }: { navigation: any }) {
    const { user } = useUser();
    const { avatar } = user;
    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.white,
        },
        drawerContent: {
            flex: 1,
        },
        drawerHeaderSection: {
            
        },
        drawerTitle: {
            color: colors.black,
            paddingTop: 20,
        },
        drawerUsername: {
            paddingTop: 10,
        },
        geoScore: {
            paddingTop: 20,
        },
        profileInfo: {
            paddingLeft: 20,
        }
    });

    return (
        <DrawerContentScrollView style={styles.container}>
            <View style={styles.drawerContent}>
                <View style={styles.profileInfo}>
                    <View>
                    <GeoCitiesAvatar src={`${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${avatar}`} size={50} />
                    </View>
                    <View style={styles.drawerTitle}>
                        <GeoCitiesBodyText fontSize={20} fontWeight='900' text="Simeon Ikudabo" />
                    </View>
                    <View style={styles.drawerUsername}>
                        <GeoCitiesBodyText color={colors.wolfGray} fontSize={15} fontWeight="normal" text="@simspeeeed" />
                    </View>
                    <View style={styles.geoScore}>
                        <GeoCitiesBodyText fontSize={15} fontWeight="normal" text="GeoScore 50" />
                    </View>
                </View>
                <Drawer.Section showDivider={false}>
                    <DrawerItem 
                        icon={() => (
                            <MaterialCommunityIcons
                                name="account"
                                size={20}
                            />
                        )}
                        label="Profile"
                        onPress={() => navigation.navigate('Profile')}
                    />
                    <DrawerItem 
                        icon={() => (
                            <MaterialCommunityIcons 
                                name="rss"
                                size={20}
                            />
                        )}
                        label="Feed"
                        onPress={() => navigation.navigate('Feed')}
                    />
                    <DrawerItem 
                        icon={() => (
                            <MaterialCommunityIcons 
                                name="home-group"
                                size={20}
                            />
                        )}
                        label="Communities"
                        onPress={() => console.log('Communities')}
                    />
                    <DrawerItem 
                        icon={() => (
                            <MaterialCommunityIcons 
                                name="email"
                                size={20}
                            />
                        )}
                        label="Messages"
                        onPress={() => console.log('Messages')}
                    />
                    <DrawerItem 
                        icon={() => (
                            <MaterialCommunityIcons 
                                name="office-building-cog"
                                size={20}
                            />
                        )}
                        label="Build Community"
                        onPress={() => console.log('Community Builder')}
                    />
                    <DrawerItem 
                        icon={() => (
                            <MaterialCommunityIcons 
                                name="calendar-multiple"
                                size={20}
                            />
                        )}
                        label="Events"
                        onPress={() => console.log('Events')}
                    />
                    <DrawerItem 
                        icon={() => (
                            <MaterialCommunityIcons 
                                name="cog"
                                size={20}
                            />
                        )}
                        label="Settings"
                        onPress={() => console.log('Settings')}
                    />
                    <DrawerItem 
                        icon={() => (
                            <MaterialCommunityIcons 
                                name="logout"
                                size={20}
                            />
                        )}
                        label="Logout"
                        onPress={() => console.log('Logout')}
                    />
                </Drawer.Section>
            </View>
        </DrawerContentScrollView>
    );
}