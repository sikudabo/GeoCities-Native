import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DrawerActions, NavigationContainer, NavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_500Medium, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { MD3DarkTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import NewRulesScreen from './pages/GroupScreen/SettingsTab/NewRuleScreen/NewRuleScreen';
import { useShowLoader } from './hooks';
import { useUser } from './hooks/storage-hooks';
import {
  BlockUsersScreen,
  BuildGroup,
  CreatePostScreen,
  Feed,
  FollowersFollowing,
  GroupScreen,
  GroupSearchScreen,
  LoginCreateStack,
  PostComments,
  Profile,
  SettingsScreen,
  UserSearchScreen,
} from './pages';
import { GeoCitiesAppBar, GeoCitiesDialog, GeoCitiesNavigationDrawer, LoadingIndicator, colors } from './components'

// Setup the QueryClient 
const queryClient = new QueryClient();

// App Display Layer Props 
type AppDisplayLayerProps = {
  fontsLoaded: boolean;
  isLoading: boolean;
  isUserLoggedIn: boolean;
  navigationRef: any;
};

// Stack navigation
const Stack = createNativeStackNavigator();

// Drawer navigation 
const Drawer = createDrawerNavigator();

// Style theming 
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.coolBlue,
    secondary: colors.salmonPink,
  },
};

export default function App() {
  return <App_DisplayLayer {...useDataLayer()} />;
}

function App_DisplayLayer({
  fontsLoaded,
  isLoading,
  isUserLoggedIn,
  navigationRef,
}: AppDisplayLayerProps) {

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const onNavigationStateChange = (state: any) => {
    // console.log('The navigation state is:', state.routeNames);
  }

  const openDrawer = () => {
    (navigationRef?.current as any)?.dispatch(DrawerActions.openDrawer())
  }

  /* if (isLoading) {
    return (
      <PaperProvider theme={theme}>
        <LoadingIndicator />
      </PaperProvider>
    );
  }*/

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <NavigationContainer ref={navigationRef as any} onStateChange={onNavigationStateChange}>
          <View onLayout={onLayoutRootView} style={styles.container}>
            <GeoCitiesAppBar navigationRef={navigationRef} openDrawer={openDrawer}/>
            <GeoCitiesDialog />
            {isLoading && <LoadingIndicator />}
            <Drawer.Navigator drawerContent={({ navigation }) => <GeoCitiesNavigationDrawer navigation={navigation} />} screenOptions={{ headerShown: false, unmountOnBlur: true }}>
              {!isUserLoggedIn && (
                <Drawer.Screen 
                  component={LoginCreateStack}
                  name="LoginCreateStack"
                  options={{
                    title: "Sign Up",
                  }}
                />
              )}
              {isUserLoggedIn && (
                <>
                  <Drawer.Screen 
                    component={Profile}
                    name="Profile"
                  />
                  <Drawer.Screen 
                    component={Feed}
                    name="Feed"
                  />
                  <Drawer.Screen 
                    component={CreatePostScreen}
                    name="CreatePost" 
                  />
                  <Drawer.Screen 
                    component={PostComments}
                    name="PostComments"
                  />
                  <Drawer.Screen 
                    component={BuildGroup}
                    name="BuildGroup"
                  />
                  <Drawer.Screen 
                    component={GroupScreen}
                    name="GroupScreen" 
                  />
                  <Drawer.Screen 
                    component={NewRulesScreen}
                    name="NewRulesScreen"
                  />
                  <Drawer.Screen 
                    component={BlockUsersScreen}
                    name="BlockUsersScreen"
                  />
                  <Drawer.Screen 
                    component={GroupSearchScreen}
                    name="GroupSearchScreen"
                  />
                  <Drawer.Screen 
                    component={FollowersFollowing}
                    name="FollowersFollowing" 
                  />
                  <Drawer.Screen 
                    component={UserSearchScreen}
                    name="UserSearchScreen" 
                  />
                  <Drawer.Screen 
                    component={SettingsScreen}
                    name="SettingsScreen"
                  />
                </>
              )}
            </Drawer.Navigator>
          </View>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}

function useDataLayer() {
  const { isLoading } = useShowLoader();
  const { user } = useUser();
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  const navigationRef = useRef();

  const isUserLoggedIn = useMemo(() => {
    if (!user || !user.isLoggedIn) {
      return false;
    }

    return true;
  }, [user])

  useEffect(() => {
    if (!isUserLoggedIn) {
      (navigationRef?.current as any)?.dispatch(DrawerActions.closeDrawer());
    }
  }, [isUserLoggedIn]);

  return {
    fontsLoaded,
    isLoading,
    isUserLoggedIn,
    navigationRef,
  };
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    fontFamily: 'Montserrat_400Regular',
    padding: 0,
    width: '100%',
  },
  imageContainer: {
    height: 400,
    paddingLeft: 0,
    paddingRight: 10,
    paddingTop: 20,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  largeText: {
    fontSize: 50,
    fontWeight: '900',
  },
  mediumText: {
    fontSize: 25,
    fontWeight: '700',
  },
  smallText: {
    fontSize: 12.5,
    fontWeight: '400',
  },
});
