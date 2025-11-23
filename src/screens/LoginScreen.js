import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView, 
    Platform,
    Dimensions,
    Image 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import { BlurView } from 'expo-blur'; <--- ELIMINADO POR ESTABILIDAD
import Checkbox from 'expo-checkbox'; 
import { Ionicons } from '@expo/vector-icons'; 

// --- CONFIGURACIÓN ---
// Ajusta tu IP según corresponda
const API_URL = 'http://localhost:8080/api/login'; 
const LOGIN_TIMEOUT = 15000;

const GRADIENT_COLORS = ['#2C5364', '#203A43', '#0F2027'];

function formatRut(rut) {
    const rutLimpio = rut.replace(/[^0-9kK]/g, '');
    if (rutLimpio.length === 0) return '';
    let cuerpo = rutLimpio.slice(0, -1);
    let dv = rutLimpio.slice(-1).toUpperCase();
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpo}-${dv}`;
}

const { height } = Dimensions.get('window');
const LogoImage = require('./../../assets/escudoubb.png');

export default function LoginScreen({ navigation }) {
    
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');
    const [isChecked, setChecked] = useState(false); 
    const [showPassword, setShowPassword] = useState(false); 
    const [isLoading, setIsLoading] = useState(false);

    const handleRutChange = (text) => {
        setRut(formatRut(text));
    };

    const handleLogin = async () => {
        if (!rut || !password) {
            Alert.alert('Datos incompletos', 'Por favor ingresa tu RUT y contraseña.');
            return;
        }

        setIsLoading(true);
        const controller = new AbortController();
        const { signal } = controller;
        const timeoutId = setTimeout(() => controller.abort(), LOGIN_TIMEOUT);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rut, password }),
                signal: signal,
            });

            clearTimeout(timeoutId);
            const data = await response.json();

            if (response.ok) {
                // Aquí pasamos el sessionId al Dashboard
                navigation.replace('Dashboard', { sessionId: data.sessionId });
            } else {
                Alert.alert('Acceso Denegado', data.message || 'Credenciales incorrectas.');
            }

        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                Alert.alert('Tiempo agotado', 'El servidor tardó demasiado en responder.');
            } else {
                Alert.alert('Error de Conexión', 'No se pudo contactar al servidor.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={GRADIENT_COLORS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardContainer}
            >
                {/* TARJETA UNIFICADA (Sin glassCard interno) */}
                <View style={styles.cardContainer}>
                    
                    {/* TÍTULO */}
                    <View style={styles.headerContainer}>
                        <Image 
                            source={LogoImage}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>ubbplayer</Text>
                    </View>

                    {/* INPUTS */}
                    <View style={styles.inputContainer}>
                        {/* Input RUT */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color="#aaa" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="RUT (12.345.678-9)"
                                placeholderTextColor="#aaa"
                                value={rut}
                                onChangeText={handleRutChange}
                                keyboardType="numeric"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Input PASSWORD */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color="#aaa" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña Intranet"
                                placeholderTextColor="#aaa"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons 
                                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                    size={20} 
                                    color="#aaa" 
                                />
                            </TouchableOpacity>
                        </View>

                        {/* CHECKBOX */}
                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                style={styles.checkbox}
                                value={isChecked}
                                onValueChange={setChecked}
                                color={isChecked ? '#4e60ff' : undefined}
                            />
                            <Text style={styles.checkboxLabel}>Mantener sesión iniciada</Text>
                        </View>
                    </View>

                    {/* BOTÓN LOGIN */}
                    <TouchableOpacity 
                        style={styles.loginButton} 
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginButtonText}>INGRESAR</Text>
                        )}
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // --- ESTILO UNIFICADO DE LA TARJETA ---
    cardContainer: {
        width: '85%', 
        height: height * 0.65, 
        borderRadius: 25,
        overflow: 'hidden', 
        
        // PROPIEDADES FUSIONADAS (antes en glassCard)
        padding: 25,
        justifyContent: 'space-between',
        // Fondo semitransparente oscuro y uniforme
        backgroundColor: 'rgba(25, 35, 46, 1)', 
        
        // Borde sutil y sombra (se mantienen)
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.1)', 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 15,
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: 1,
        lineHeight: 30,
        marginTop: -18,
    },
    inputContainer: {
        width: '100%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)', 
        borderRadius: 12,
        marginBottom: 15,
        paddingHorizontal: 15,
        height: 55,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingLeft: 15,
    },
    checkbox: {
        marginRight: 10,
        borderRadius: 5,
        borderColor: '#aaa',
    },
    checkboxLabel: {
        color: '#ccc',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#4e60ff', 
        borderRadius: 12,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#4e60ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5, 
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});