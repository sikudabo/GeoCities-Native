import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInPage from "./SignInPage/SignInPage";
import SignUpPage from './SignUpPage/SignUpPage';
import { colors } from "../components";

const Stack = createNativeStackNavigator();

export default function LoginCreateStack() {
    return (
        <Stack.Navigator initialRouteName="Sign In" screenOptions={{ headerStyle: { backgroundColor: colors.nightGray }, headerTintColor: colors.white }}>
            <Stack.Screen 
                component={SignInPage}
                name="SignIn"
                options={{
                    title: "Sign In",
                }}
            />
            <Stack.Screen 
                component={SignUpPage}
                name="SignUp"
                options={{
                    title: "Sign Up",
                }}
            />
        </Stack.Navigator>
    );
}