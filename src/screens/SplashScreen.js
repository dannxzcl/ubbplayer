// src/screens/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, Animated, StatusBar, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GRADIENT_COLORS = ['#2C5364', '#203A43', '#0F2027'];
const WAIT_TIME = 500; 
const LogoImage = require('./../../assets/escudoubb.png');

// Recibimos la prop onFinish en lugar de navigation
export default function SplashScreen({ onFinish }) {
    
    const fadeAnim = useRef(new Animated.Value(1)).current; // Empezamos en 1 (visible)
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.sequence([
            // 1. Entrada del logo (Zoom y Fade In si fuera necesario, aquí asumo opacity 1 inicial)
            Animated.spring(scaleAnim, {
                toValue: 1, 
                friction: 7,
                tension: 10,
                useNativeDriver: true,
            }),

            // 2. Espera
            Animated.delay(WAIT_TIME),

            // 3. Salida (Desvanecer TODO el componente)
            Animated.timing(fadeAnim, {
                toValue: 0, 
                duration: 800, 
                useNativeDriver: true,
            })
        ]).start(() => {
            // 4. Al terminar, llamamos a la función que desmontará este componente
            if (onFinish) onFinish();
        });

    }, []);

    return (
        // Animated.View envuelve TODO para poder desvanecer el fondo también
        <Animated.View style={[styles.fullScreen, { opacity: fadeAnim }]}>
            <LinearGradient
                colors={GRADIENT_COLORS}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                <StatusBar hidden />
                <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
                    <Image source={LogoImage} style={styles.logo} resizeMode="contain" />
                    <Text style={styles.appName}>ubbplayer</Text>
                </Animated.View>
            </LinearGradient>
        </Animated.View>
    );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    fullScreen: {
        position: 'absolute', // CLAVE: Posición absoluta para tapar todo
        top: 0,
        left: 0,
        width: width,
        height: height,
        zIndex: 100, // Asegura que esté encima de todo
        backgroundColor: '#0F2027', // Fondo de seguridad
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: width * 0.5,
        height: width * 0.5,
    },
    appName: {
        marginTop: -35,
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1,
    }
});