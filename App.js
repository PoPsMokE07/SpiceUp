import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import { AuthProvider } from './backend/AuthContext.js';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native'; // Import View and Text for demonstration purposes
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import UploadScreen from './screens/UploadScreen';
import ManualAddScreen from './screens/ManuallyAddScreen.js';
import PlantIdentificationScreen from './screens/PlantIdentificationScreen';
import PantryIdentificationTest from './screens/PantryIdentificationTest';
import PantryScreen from './screens/PantryScreen';
import WelcomeScreen from './screens/Welcome';
import RecipeGenerationScreen from './screens/RecipeGenerationScreen';


const Stack = createNativeStackNavigator();

const loadFonts = async () => {
  await Font.loadAsync({
    'KumbhSans-Regular': require('./assets/fonts/KumbhSans-Regular.ttf'),
    'KumbhSans-Bold': require('./assets/fonts/KumbhSans-Bold.ttf'),
  });
};

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await loadFonts();
      setFontsLoaded(true);
    })();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Upload" component={UploadScreen} />
        <Stack.Screen name="ManualAdd" component={ManualAddScreen} />
        <Stack.Screen name="Plant Identity" component={PlantIdentificationScreen} />
        <Stack.Screen name="Create Pantry" component={PantryIdentificationTest} />
        <Stack.Screen name="Pantry" component={PantryScreen} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="Recipe Gen" component={RecipeGenerationScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4F6F3',
  },
  text: {
    fontFamily: 'KumbhSans-Regular',
  },
  boldText: {
    fontFamily: 'KumbhSans-Bold',
  },
});

export default App;
