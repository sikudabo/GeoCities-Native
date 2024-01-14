import { useCallback, useRef } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import { DrawerActions, NavigationContainer, NavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFonts, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { MD3DarkTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import { useShowLoader } from './hooks';
import { Feed, Profile, SamplePage, SignUpPage } from './pages';
import { GeoCitiesAppBar, GeoCitiesNavigationDrawer, LoadingIndicator, colors } from './components'

// App Display Layer Props 
type AppDisplayLayerProps = {
  fontsLoaded: boolean;
  isLoading: boolean;
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
}: AppDisplayLayerProps) {

  const navigationRef = useRef();

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const onNavigationStateChange = (state: any) => {
    console.log('The navigation state is:', state.routeNames);
  }

  const openDrawer = () => {
    (navigationRef?.current as any)?.dispatch(DrawerActions.openDrawer())
  }

  if (isLoading) {
    return (
      <PaperProvider theme={theme}>
        <LoadingIndicator />
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer ref={navigationRef as any} onStateChange={onNavigationStateChange}>
        <View onLayout={onLayoutRootView} style={styles.container}>
          <GeoCitiesAppBar navigationRef={navigationRef} openDrawer={openDrawer}/>
          <Drawer.Navigator drawerContent={({ navigation }) => <GeoCitiesNavigationDrawer navigation={navigation} />} screenOptions={{ headerShown: false }}>
            <Drawer.Screen 
              component={SignUpPage}
              name="SignUp"
              options={{
                title: "Sign Up",
              }}
            />
            <Drawer.Screen 
              component={SamplePage}
              name="Sample"
              options={{
                title: "Hello world",
              }}
            />
            <Drawer.Screen 
              component={Feed}
              name="Feed"
            />
            <Drawer.Screen 
              component={Profile}
              name="Profile"
            />
          </Drawer.Navigator>
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
}

function useDataLayer() {
  const { isLoading } = useShowLoader();
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
  });

  return {
    fontsLoaded,
    isLoading,
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
