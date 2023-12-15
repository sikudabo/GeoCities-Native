import { useCallback, useRef } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { MD3DarkTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import { Feed, Profile } from './pages';
import { GeoCitiesAppBar, colors } from './components'

// App Display Layer Props 
type AppDisplayLayerProps = {
  fontsLoaded: boolean;
};

// Stack navigation
const Stack = createNativeStackNavigator();

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

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer ref={navigationRef as any} onStateChange={onNavigationStateChange}>
        <View style={styles.container}>
          <GeoCitiesAppBar navigationRef={navigationRef} />
          <Stack.Navigator initialRouteName="Profile" screenOptions={{ gestureEnabled: false, headerShown: false }}>
            <Stack.Screen 
              component={Feed}
              name="Feed"
            />
            <Stack.Screen 
              component={Profile}
              name="Profile"
            />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
}

function useDataLayer() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
  });

  return {
    fontsLoaded,
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
