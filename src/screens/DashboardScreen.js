// src/screens/DashboardScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Asegúrate de que esto esté importado

export default function DashboardScreen({ route }) {
    const { sessionId } = route.params;

    // 1. Colores extraídos del CSS
    const gradientColors = ['#2C5364', '#203A43', '#0F2027'];

    return (
        // 2. Componente LinearGradient con la dirección 'to right'
        <LinearGradient
            colors={gradientColors} 
            start={{ x: 0, y: 0.5 }} // Inicia a la izquierda
            end={{ x: 1, y: 0.5 }}   // Termina a la derecha
            style={styles.fullScreen}
        >
            {/* 3. Contenido (¡con estilos de texto claros para contraste!) */}
            <View style={styles.contentContainer}>
                <Text style={styles.title}>¡Login Exitoso!</Text>
                <Text style={styles.text}>Tu Session ID es:</Text>
                <Text style={styles.sessionIdText}>{sessionId}</Text>
            </View>

        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#FFFFFF', // Texto Blanco para contraste con el fondo oscuro
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        color: '#CCCCCC', // Gris claro para el texto secundario
    },
    sessionIdText: {
        fontSize: 14,
        fontFamily: 'monospace',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fondo semi-transparente claro
        padding: 10,
        borderRadius: 5,
        color: '#FFFFFF',
    }
});