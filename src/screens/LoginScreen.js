import React, { useState, useRef } from 'react'; 
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
    Image,
    ScrollView,
    Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import { BlurView } from 'expo-blur'; 
import Checkbox from 'expo-checkbox'; 
import { Ionicons } from '@expo/vector-icons'; 

// --- CONFIGURACIÓN ---
const API_URL = 'http://localhost:8080/api/login'; 
const LOGIN_TIMEOUT = 15000;
const GRADIENT_COLORS = ['#2C5364', '#203A43', '#0F2027'];

// --- DATOS DE LA LANDING PAGE ---
const features = [
    {
        id: 1,
        title: 'Tracking Académico',
        description: 'Gráficos detallados de tu rendimiento por área curricular.',
        icon: 'stats-chart'
    },
    {
        id: 2,
        title: 'Malla Interactiva',
        description: 'Visualiza tu avance curricular y promedios por ramo.',
        icon: 'git-network'
    },
    {
        id: 3,
        title: 'Leaderboard',
        description: 'Compara tu rendimiento con otros estudiantes que utilicen la aplicación.',
        icon: 'trophy'
    },
    {
        id: 4,
        title: 'Gestión simplificada',
        description: 'Ve el contenido de Adecca por ramo, utiliza pomodoro vinculado a tus asignaturas y mucho más.',
        icon: 'calendar'
    }
];

function formatRut(rut) {
    const rutLimpio = rut.replace(/[^0-9kK]/g, '');
    if (rutLimpio.length === 0) return '';
    let cuerpo = rutLimpio.slice(0, -1);
    let dv = rutLimpio.slice(-1).toUpperCase();
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpo}-${dv}`;
}

const { width, height } = Dimensions.get('window');
const LogoImage = require('./../../assets/escudoubb.png');

// --- CÁLCULOS PARA EL CARRUSEL CENTRADO ---
const CARD_WIDTH = width * 0.75; // Ancho de la tarjeta (75% pantalla)
const CARD_MARGIN = 20; // Margen derecho entre tarjetas
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN; // Intervalo total para el snap

// Padding lateral para centrar la primera y última tarjeta
// Fórmula: (AnchoPantalla - AnchoTarjeta) / 2 - (MargenDerecho / 2)
// Esto asegura que el espacio a la izquierda de la primera tarjeta sea igual al espacio a la derecha
const SIDE_PADDING = (width - CARD_WIDTH) / 2 - (CARD_MARGIN / 2);

export default function LoginScreen({ navigation }) {
    
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');
    const [isChecked, setChecked] = useState(false); 
    const [showPassword, setShowPassword] = useState(false); 
    const [isLoading, setIsLoading] = useState(false);

    // 1. VARIABLE ANIMADA PARA EL SCROLL
    const scrollY = useRef(new Animated.Value(0)).current;

    // 2. INTERPOLACIÓN:
    const backgroundOpacity = scrollY.interpolate({
        inputRange: [0, height], 
        outputRange: [0, 0.86],   
        extrapolate: 'clamp',    
    });

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

    // --- COMPONENTE TARJETA DE FUNCIÓN ---
    const FeatureCard = ({ item }) => (
        <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
                <Ionicons name={item.icon} size={32} color="#4e60ff" />
            </View>
            <Text style={styles.featureTitle}>{item.title}</Text>
            <Text style={styles.featureDescription}>{item.description}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* FONDO DEGRADADO FIJO */}
            <LinearGradient
                colors={GRADIENT_COLORS}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill} 
            />

            {/* CAPA DE OSCURECIMIENTO ANIMADA */}
            <Animated.View 
                style={[
                    StyleSheet.absoluteFill, 
                    { backgroundColor: '#000', opacity: backgroundOpacity }, 
                    { zIndex: 0 } 
                ]} 
            />

            {/* SCROLLVIEW PRINCIPAL */}
            <Animated.ScrollView
                pagingEnabled={true} 
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={height} 
                contentContainerStyle={{ flexGrow: 1 }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false } 
                )}
                scrollEventThrottle={16} 
            >
                {/* --- SECCIÓN 1: LOGIN --- */}
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.screenSection} 
                >
                    <View style={styles.cardContainer}>
                        
                        <View style={styles.headerContainer}>
                            <Image 
                                source={LogoImage}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <Text style={styles.title}>ubbplayer</Text>
                        </View>

                        <View style={styles.inputContainer}>
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

                    <View style={styles.scrollIndicator}>
                        <Text style={styles.scrollText}>Conoce más</Text>
                        <Ionicons name="chevron-down" size={24} color="#aaa" />
                    </View>

                </KeyboardAvoidingView>

                {/* --- SECCIÓN 2: LANDING PAGE --- */}
                <View style={styles.screenSection}>
                    <View style={styles.landingContent}>
                        <Text style={styles.landingTitle}>¿Qué es esto?</Text>
                        <Text style={styles.landingSubtitle}>
                            Construí esta aplicación para maximizar tus resultados académicos en la UBB.
                        </Text>

                        {/* CARRUSEL HORIZONTAL MODIFICADO */}
                        <View style={{ height: 280, marginTop: 20 }}>
                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false}
                                // Aplicamos el padding calculado para centrar
                                contentContainerStyle={{ paddingHorizontal: Math.max(0, SIDE_PADDING) }}
                                snapToInterval={SNAP_INTERVAL} 
                                decelerationRate="fast" 
                                snapToAlignment="start" // "start" funciona mejor con padding manual
                            >
                                {features.map((item) => (
                                    <FeatureCard key={item.id} item={item} />
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>

            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    screenSection: {
        height: height,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    // --- ESTILOS LOGIN ---
    cardContainer: {
        width: '85%', 
        height: height * 0.65, 
        borderRadius: 25,
        overflow: 'hidden', 
        padding: 25,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(25, 35, 46, 1)', 
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.1)', 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
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

    // --- ESTILOS LANDING PAGE ---
    scrollIndicator: {
        position: 'absolute',
        bottom: 40,
        alignItems: 'center',
    },
    scrollText: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 5,
    },
    landingContent: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 50,
    },
    landingTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    landingSubtitle: {
        fontSize: 16,
        color: '#ccc',
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 22,
    },
    featureCard: {
        width: CARD_WIDTH, // Usamos la constante calculada
        height: 250,
        backgroundColor: 'rgba(25, 35, 46, 0.9)', 
        borderRadius: 20,
        padding: 20,
        marginRight: CARD_MARGIN, // Usamos la constante
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    featureIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(78, 96, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    featureTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: 14,
        color: '#bbb',
        textAlign: 'center',
        lineHeight: 20,
    }
});