import React, {useEffect, useRef} from 'react';
import {Text, TouchableOpacity, StyleSheet, Animated, Easing} from 'react-native';

const WelcomeScreen = ({ navigation }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(25)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 1000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 1000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            })
        ]).start();
    }, [opacity, translateY]);
    
    return (
        
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Home')} activeOpacity={1}>
            <Animated.Image
                source={require('../assets/logo.png')}
                style={[styles.image, {opacity: opacity, transform: [{translateY: translateY}],}]}/>
            <Animated.View style={{ opacity: opacity, transform: [{ translateY: translateY }] }}>
                <Text style={styles.headline}>SpiceUp</Text>
            </Animated.View>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Animated.View style={{opacity: opacity, transform: [{translateY: translateY}]}}>
                    <Text style={styles.buttonText}>Tap to enter</Text>
                </Animated.View>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF9C4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headline: {
        fontSize: 64,
        color: '#587745',
        marginBottom: 10,
        fontWeight: '800',
        alignSelf: 'center',
        fontFamily: 'KumbhSans-Bold',
    },
    image: {
        width: '50%',
        height: '30%',
        alignSelf: 'center',
        resizeMode: 'contain',
        marginTop: 0,
    },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 200,
        alignSelf: 'center',
        borderRadius: 20,
        marginTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontFamily: 'KumbhSans-Bold',
    },
});

export default WelcomeScreen;
