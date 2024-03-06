import { useEffect, useState } from 'react';
import truncate from 'lodash/truncate';
import { StyleSheet, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Drawer, Title } from 'react-native-paper';
import { DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import GeoCitiesAvatar from './GeoCitiesAvatar';
import GeoCitiesBodyText from './GeoCitiesBodyText';
import { colors } from './colors';
import { useUser } from '../hooks/storage-hooks';

export default function GeoCitiesNavigationDrawer({ navigation }: { navigation: any }) {
    const { clearUser, user } = useUser();
    const { avatar, geoScore, firstName, lastName } = user;
    const fullName = `${firstName} ${lastName}`;
    const queryClient = useQueryClient();
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

    function handleProfileNavigation() {
        queryClient.invalidateQueries(['fetchProfilePosts']);
        navigation.navigate('Profile');
    }

    function handleLogout() {
        clearUser();
        navigation.navigate('LoginCreateStack');
    }

    return (
        <DrawerContentScrollView style={styles.container}>
            <View style={styles.drawerContent}>
                <View style={styles.profileInfo}>
                    <View>
                    <GeoCitiesAvatar src={`${process.env.EXPO_PUBLIC_API_BASE_URI}get-photo/${avatar}`} size={50} />
                    </View>
                    <View style={styles.drawerTitle}>
                        <GeoCitiesBodyText fontSize={20} fontWeight='900' text={truncate(fullName, { length: 40 })}/>
                    </View>
                    <View style={styles.geoScore}>
                        <GeoCitiesBodyText fontSize={15} fontWeight="normal" text={`GeoScore: ${geoScore}`} />
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
                        onPress={handleProfileNavigation}
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
                        label="Groups"
                        onPress={() => navigation.navigate('GroupSearchScreen')}
                    />
                    {/*<DrawerItem 
                        icon={() => (
                            <MaterialCommunityIcons 
                                name="email"
                                size={20}
                            />
                        )}
                        label="Messages"
                        onPress={() => console.log('Messages')}
                        />
                    */}
                    <DrawerItem 
                        icon={() => (
                            <MaterialCommunityIcons
                                name="magnify"
                                size={20}
                            />
                        )}
                        label="Users"
                        onPress={() => console.log('Users')}
                    />
                    <DrawerItem 
                        icon={() => (
                            <MaterialCommunityIcons 
                                name="office-building-cog"
                                size={20}
                            />
                        )}
                        label="Create Group"
                        onPress={() => navigation.navigate('BuildGroup')}
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
                        onPress={handleLogout}
                    />
                </Drawer.Section>
            </View>
        </DrawerContentScrollView>
    );
}