import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import AddScreen from "./screens/AddScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="#fef3c7" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f97316",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 20,
          },
          headerShadowVisible: true,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "My Happy Memories",
            headerStyle: {
              backgroundColor: "#f97316",
            },
          }}
        />
        <Stack.Screen
          name="Add"
          component={AddScreen}
          options={{
            title: "Create New Memory",
            headerStyle: {
              backgroundColor: "#f97316",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
