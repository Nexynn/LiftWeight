import { Stack } from "expo-router";
import { View, Text } from 'react-native';

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name="(tabs)/index" 
            options={
                {
                    headerShown: false
                }
            }/> 
        </Stack>
    );
}
export default Layout;