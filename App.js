// App.js
import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import SplashScreen from './src/screens/SplashScreen'; 

const Stack = createNativeStackNavigator();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0F2027', 
  },
};

export default function App() {
  // Estado para controlar si mostramos el Splash
  const [isShowSplash, setIsShowSplash] = useState(true);

  return (
    <>
        {/* 1. La App normal carga DEBAJO (Login es la primera pantalla) */}
        <NavigationContainer theme={AppTheme}>
            <Stack.Navigator 
                initialRouteName="Login" // Login inicia directamente
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#0F2027' }
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen 
                    name="Dashboard" 
                    component={DashboardScreen} 
                    options={{ headerShown: true, title: 'Mi Progreso' }} 
                />
            </Stack.Navigator>
        </NavigationContainer>

        {/* 2. El Splash se renderiza ENCIMA (condicionalmente) */}
        {isShowSplash && (
            <SplashScreen onFinish={() => setIsShowSplash(false)} />
        )}
    </>
  );
}