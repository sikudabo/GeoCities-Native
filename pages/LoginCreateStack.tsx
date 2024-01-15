import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInPage from "./SignInPage/SignInPage";
import SignUpPage from './SignUpPage/SignUpPage';

const Stack = createNativeStackNavigator();

export default function LoginCreateStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                component={SignInPage}
                name="Sign In"
            />
            <Stack.Screen 
                component={SignUpPage}
                name="Sign Up"
            />
        </Stack.Navigator>
    );
}