// App.js (el archivo raíz)

import React from 'react';
// 1. Importar los componentes de navegación
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 2. Importar nuestras pantallas
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';

// 3. Inicializar el navegador "Stack" (pila de pantallas)
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // 4. Contenedor principal de navegación
    <NavigationContainer>
      
      {/* 5. Definimos nuestro "stack" de pantallas */}
      {/* initialRouteName="Login" le dice a la app que empiece en LoginScreen */}
      <Stack.Navigator initialRouteName="Login">
        
        {/* Definimos la pantalla de Login */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          // Ocultamos la barra de título superior en la pantalla de Login
          options={{ headerShown: false }} 
        />
        
        {/* Definimos la pantalla de Dashboard */}
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          // Esta sí mostrará un título (ej: "Dashboard")
          options={{ title: 'Mi Progreso' }} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Nota: Ya no necesitamos los estilos que venían por defecto en App.js